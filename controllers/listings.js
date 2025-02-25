const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req , res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index" , {allListings});
}


module.exports.renderNewForm =  (req , res)=>{
    res.render("listings/new")
}

module.exports.showListing = async(req , res) =>{
    let { id } = req.params;
   const listing = await Listing.findById(id).populate({
    path: "reviews", 
    populate:{
    path: "author"
   },
    }).populate("owner");
   if(!listing){
    req.flash("error" , "Lisitng you requested for does not exist!");
    res.redirect("/listings");
   }
   console.log(listing);
   res.render("listings/show" , {listing});

}

module.exports.createListing = async (req, res , next) =>{
   let response =  await geocodingClient
   .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send();

        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url , filename};

        newListing.geometry = response.body.features[0].geometry;

        let savedLisitng = await newListing.save();
        console.log(savedLisitng);
        
        req.flash("success", "New Listing Created")
        res.redirect("/listings");
   }


module.exports.renderEditForm = async (req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
     req.flash("error" , "Lisitng you requested for does not exist!");
     res.redirect("/listings");
    }
    
    let originalImageUrl = listing.image.url;
    originalImageUrl =  originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit" , {listing , originalImageUrl});
 };


module.exports.updateListing = async(req, res)=>{
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }
    req.flash("success" , "Listing Updated")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyLisitng = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted")
    res.redirect("/listings")
    
}


module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;
    const filteredListings = await Listing.find({ category });
    if (!filteredListings.length) {
        req.flash("error", "No listings found in this category.");
        return res.redirect("/listings");
    }
    res.render("listings/index", { allListings: filteredListings });
};


module.exports.searchListings = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        req.flash("error", "Please enter a search query.");
        return res.redirect("/listings");
    }

    const searchResults = await Listing.find({
        $or: [
            { title: { $regex: q, $options: "i" } }, 
            { description: { $regex: q, $options: "i" } }, 
        ],
    });

  
    if (!searchResults.length) {
        req.flash("error", `No listings found for "${q}".`);
        return res.redirect("/listings");
    }

    res.render("listings/index", { allListings: searchResults });
};


module.exports.searchSuggestions = async (req, res) => {
    const { q } = req.query;

    // Return an empty array if the query is missing or too short
    if (!q || q.length < 2) {
        return res.json([]);
    }

    // Find matching listings by title
    const suggestions = await Listing.find({
        title: { $regex: q, $options: "i" }, // Case-insensitive match
    }).select("title").limit(5);

    // Return the suggestions as JSON
    res.json(suggestions);
};
