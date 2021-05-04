const express = require("express");
const methodOverride = require("method-override");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", `Thanks for the review!`);
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId", isLoggedIn, isReviewAuthor,
  catchAsync(async (req, res) =>
  {
    console.log(req.params)
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(
      id,
      { $pull: { reviews: reviewId } },
      { useFindAndModify: false }
    );
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
