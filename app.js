 if(process.env.NODE_ENV !== "production")
 {
     require('dotenv').config()
 }



// console.log(process.env.CLOUDINARY_CLOUD_NAME)
// console.log(process.env.CLOUDINARY_KEY)
// console.log(process.env.CLOUDINARY_SECRET)
// console.log(process.env)
// console.log(process.env.NODE_ENV)


const express=require('express')
const path = require('path')
const app=express()
const mongoose = require('mongoose')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo')

const campgroundRoutes = require('./Routes/campgrounds.js')
const reviewRoutes = require('./Routes/reviews.js')
const userRoutes = require('./Routes/user.js')
//const MongoDBStore = require('connect-mongo')
const dbUrl = 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl)
const db= mongoose.connection
db.on("error", console.error.bind(console,"connection error :"))
db.once("open", () =>
{
    console.log("Database Connected")
})

app.use(flash())
app.engine('ejs', ejsMate)
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());

const store = MongoStore.create({

    mongoUrl : dbUrl,
   touchAfter : 24 * 60 * 60,
   crypto : {
     secret : 'thisshouldbeabettersecret!',
   }

})

store.on("error", function(e)
{
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name : 'session',
    secret :'thisshouldbeabettersecret!',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7, // Date.now() in milliseconds, we want the expiry after week so multiply
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next) =>
{
  
    //console.log(req.user)
    res.locals.currentUser=req.user // req.user is from passport , which stores the session information of who is logged in
    res.locals.success = req.flash('success') 
    res.locals.error = req.flash('error')
    next()
})


app.use('/campgrounds/:id/reviews', reviewRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/',userRoutes)

app.get('/',(req,res) =>
{
    res.render('home')
})

app.all('*', (req,res,next) =>
{
    next(new ExpressError('Page Not Found!!', 404))
})

app.use((err,req,res,next) => 
{
    const {status = 500} = err
    if(!err.message) err.message="Something went wrong!!"
    res.status(status).render('error',{err})
})


app.listen(3000, ()=>
(
        console.log("Listening to the port 3000!!")
 ))