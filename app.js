const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')

const methodOverride = require("method-override")
const Campground = require('./models/campground')




mongoose.connect('mongodb://localhost:27017/campmate', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})



const db = mongoose.connection;
//checking for errors on mongoose connection to mongo
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>
{   
    console.log("Database Connected")
})

//using ejs engine instead of default express engine
app.engine('ejs', ejsMate);
//setting our view engine to ejs
app.set('view engine', 'ejs')
//joining our views path to our working directory, establishing an absolute path to views
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));


app.get('/', (req, res) =>
{
    res.render("home")
})



app.get('/campgrounds', async (req, res) =>
{
    try
    {
        const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds})
    } catch (e)
    {
        console.log(e)
    }
})

app.get('/campgrounds/new', (req, res) =>
{
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) =>
{
    try
    {
        const campground = new Campground(req.body.campground)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    } catch (e)
    {
        console.log(e)
   }
})

app.get('/campgrounds/:id', async (req, res) =>
{
    try
    {
        const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground})
    } catch (e)
    {
        console.log(e)
   }
})

app.get('/campgrounds/:id/edit', async (req, res) =>
{
    try
    {
        const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground})
    } catch (e)
    {
        console.log(e)
    }
})

//put route through methodOverride on form, with POST method
app.put('/campgrounds/:id', async (req, res) =>
{
    const { id } = req.params;
    //find and update by id and spread request body for changes
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
})


app.delete('/campgrounds/:id', async (req, res)=> {
    try
    {
        const { id } = req.params;
    await Campground.findByIdAndDelete(id, {useFindAndModify: false})
    res.redirect('/campgrounds')
    } catch (e)
    {
        console.log(e)
    }
})



app.listen(3000, () =>
{
    console.log("Serving on Port 3000!")
})

