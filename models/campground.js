const mongoose = require('mongoose');
const Review = require('./review')
const User = require('./user')
const Schema= mongoose.Schema
const opts = { toJSON: { virtuals: true } };
const ImageSchema = new Schema({
    url : String,
    filename : String
})

//By setting a virtual property we will not store that data in database
ImageSchema.virtual('thumbnail').get(function()
{
    return this.url.replace('/upload', '/upload/w_200')
})

const campgroundSchema = new Schema(
    {
        title : String,
        images : [ImageSchema],
        price : Number,
        description: String,
        location : String,
        geometry: {
            type: {
              type: String, // Don't do `{ location: { type: String } }`
              enum: ['Point'], // 'location.type' must be 'Point'
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            }
          },
        author : {

            type: Schema.Types.ObjectId,
            ref:'User'

        },
        reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
    }, opts
)

//Middleware to delete all associated reviews with that particular campground
campgroundSchema.post('findOneAndDelete', async function(doc)
{
    if(doc)
    {
        await Review.deleteMany({
           _id: {
            $in : doc.reviews
           }
        })
    }
})

campgroundSchema.virtual('properties.popUpMessage').get(function() 
{
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
})

const Campground = mongoose.model('Campground',campgroundSchema)
module.exports = Campground