const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema } = require("../schemas");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    console.log(campground.title)
      req.flash("success", `Successfully created ${campground.title}`)
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).populate("reviews");
    if (!campground)
    {
      req.flash('error', 'Cannot find Campground')
      return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show", { campground });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground)
    {
      req.flash('error', 'Cannot find Campground')
      return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit", { campground });
  })
);

//put route through methodOverride on form, with POST method
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    //find and update by id and spread request body for changes
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", `Successfully Updated ${campground.title}`)
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id, { useFindAndModify: false });
    req.flash('success', `Successfully deleted!`)
    res.redirect("/campgrounds");
  })
);

module.exports = router;
