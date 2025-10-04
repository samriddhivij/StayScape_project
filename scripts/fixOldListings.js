if(process.env.NODE_ENV!="production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("../models/listing"); // adjust path if needed

const locationIQKey = process.env.LOCATIONIQ_API_KEY;

async function geocodeAndUpdateListings() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/stayscape");

    const listings = await Listing.find({ geometry: { $exists: false } });

    for (let listing of listings) {
      try {
        const response = await axios.get("https://us1.locationiq.com/v1/search", {
          params: {
            key: locationIQKey,
            q: listing.location,
            format: "json",
            limit: 1,
          },
        });

        if (response.data && response.data.length > 0) {
          listing.geometry = {
            lat: parseFloat(response.data[0].lat),
            lng: parseFloat(response.data[0].lon),
          };
          await listing.save();
          console.log(`Updated: ${listing.title}`);
        }
      } catch (err) {
        console.error(`Failed to update ${listing.title}:`, err.message);
      }
    }

    console.log("Done updating old listings.");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  } finally {
    mongoose.connection.close();
  }
}

geocodeAndUpdateListings();
