const Listing=require("../models/listing.js");
const axios=require("axios");

module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm=(req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing= async (req, res) => {
  let id = req.params.id.trim();
  const listing = await Listing.findById(id).populate({path:"reviews", populate: {
    path:"author",
  },
}).populate("owner");
  if(!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  //console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing=async (req, res, next) => {
  const { location } = req.body.listing;

  // Call LocationIQ for geocoding
  let geometry = { lat: 0, lng: 0 }; // fallback in case API fails

  try {
    const response = await axios.get("https://us1.locationiq.com/v1/search", {
      params: {
        key: process.env.LOCATIONIQ_API_KEY,
        q: location,
        format: "json",
        limit: 1
      }
    });

    if (response.data && response.data.length > 0) {
      geometry.lat = parseFloat(response.data[0].lat);
      geometry.lng = parseFloat(response.data[0].lon);
    }
  } catch (err) {
    console.error("LocationIQ error:", err.message);
  }

  let url=req.file.path;
  let filename=req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  newListing.geometry = geometry;
  await newListing.save();
  console.log("New Listing:", newListing);
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
}; 

module.exports.renderEditForm=async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl=originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing,originalImageUrl });
};

module.exports.updateListing=async (req, res) => {
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined") {
  let url=req.file.path;
  let filename=req.file.filename;
  listing.image={url,filename};
  await listing.save();
  }

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};