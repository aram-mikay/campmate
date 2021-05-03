const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");

const { isLoggedIn, isAuthor,validateCampground } = require("../middleware");



router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    console.log(campground.title);
    req.flash("success", `Successfully created ${campground.title}`);
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id)
      .populate("reviews")
      .populate("author");

    if (!campground) {
      req.flash("error", "Cannot find Campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn, isAuthor,
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find Campground");
      return res.redirect("/campgrounds");
    }
  
    res.render("campgrounds/edit", { campground });
  })
);

//put route through methodOverride on form, with POST method
router.put(
  "/:id",
  isLoggedIn,isAuthor,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    //find and update by id and spread request body for changes
 
    req.flash("success", `Successfully Updated ${campground.title}`);
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id", isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id, { useFindAndModify: false });
    req.flash("success", `Successfully deleted!`);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
