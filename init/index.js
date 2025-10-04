const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/stayscape"; 

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB= async ()=>{
    try {
    await Listing.deleteMany({});
    const ownerId = new mongoose.Types.ObjectId("6864134e14d117166d778260");
    initData.data=initData.data.map((obj)=>({...obj , owner:ownerId}));
    await Listing.insertMany(initData.data);
    console.log("New listings inserted");
} 
catch(err) {
    console.log("error inserting data:", err);
}
};
initDB();
