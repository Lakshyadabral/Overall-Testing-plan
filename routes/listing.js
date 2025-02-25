const express = require ("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner , validateListing } = require("../middleware");

const listingController = require("../controllers/listings")
const multer  = require('multer')
const {storage} = require("../cloudConfig")
const upload = multer({ storage })




router.route("/")
.get( wrapAsync (listingController.index))
.post(isLoggedIn, upload.single('listing[image]') ,
validateListing ,  wrapAsync(listingController.createListing)
)

//New Route 
router.get("/new", isLoggedIn , listingController.renderNewForm)

// Filter route
router.get("/filter/:category", wrapAsync(listingController.filterByCategory));

//Search route 
router.get("/search", wrapAsync(listingController.searchListings));


//Search Suggestions
router.get("/search/suggestions", wrapAsync(listingController.searchSuggestions));



router.route("/:id")
.get( wrapAsync (listingController.showListing))
.put(isOwner, isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing) 
)
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyLisitng))




// edit route 
router.get("/:id/edit" , isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));








module.exports = router;