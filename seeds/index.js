const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const {descriptors, places} = require('./seedHelper')

mongoose.connect('mongodb://localhost:27017/campmate', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>
{   
    console.log("Database Connected")
})

const sampleData = arr => arr[Math.floor(Math.random() * arr.length)]

//creating dummy seed data to work with
const seedDB = async () =>
{
    await Campground.deleteMany({});
    for (let index = 0; index < 50; index++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({location: `${cities[random1000].city}, ${cities[random1000].state}`, title: `${sampleData(descriptors)} ${sampleData(places)}`})
        await camp.save()
    }

}

//seed and close DB
seedDB().then(() =>
{
    mongoose.connection.close()
});