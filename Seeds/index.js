const mongoose = require('mongoose')
const Campground=require('../models/campground')
const cities= require('./cities')
const {descriptors, places}=require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db=mongoose.connection

db.on("error", console.error.bind(console,"connection error :"))
db.once("open",() =>
{
    console.log("MongoDB connected")
})

const sample = array => array[Math.floor(Math.random() * array.length)] // simpest way to get the random number inside the array

const seedDB = async() =>
{
    await Campground.deleteMany({})
    for(let i=0;i<200;i++)
    {
        
        const random1000 = Math.floor(Math.random() * 1000)
        const price =  Math.floor(Math.random()*20)+10
        const camp = new Campground({
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            
            description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla ratione aliquid dolorum alias quaerat eius et! Eaque quia ullam aliquam suscipit facilis repellendus dolores, vero, unde esse, expedita quis autem",
            price,
            author : '65140a3119492e3c28e67caa',
            images : [
                {
                  url: 'https://res.cloudinary.com/djsp5jsnw/image/upload/v1697267814/yelpCamp/upa5dxk1oxedeoov0zoo.jpg',
                  filename: 'yelpCamp/upa5dxk1oxedeoov0zoo',
                 
                },
                {
                  url: 'https://res.cloudinary.com/djsp5jsnw/image/upload/v1697267815/yelpCamp/yrn9uthgkqofdcyfxui4.jpg',
                  filename: 'yelpCamp/yrn9uthgkqofdcyfxui4',
                  
                }
              ],

            geometry: { 
                type: 'Point', 
                coordinates:
                [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },

        })

        await camp.save()
        
    }
}

seedDB().then(() =>
{
    mongoose.connection.close()
})


