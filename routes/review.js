const express = require ("express");
const router = express.Router({mergeParams: true});
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware")
const reviewController =  require ("../controllers/reviews");



// Reviews
// Post Route
router.post("/" ,  validateReview , isLoggedIn, wrapAsync (reviewController.createReview));
 
 // Delete review Route
 
 router.delete("/:reviewId" , isLoggedIn , isReviewAuthor, wrapAsync(reviewController.destroyReview))
 
 module.exports = router