const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
    
}).catch(err =>{
    console.log(err);
    
})

async function main() {
    mongoose.connect(MONGO_URL);
}


const initDB = async()=>{
   await  Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({
   ...obj , owner: "6760f832a1bc5286b92ea5b4"
   }))
   await Listing.insertMany(initData.data)
   console.log("Data was Initialized")
}

initDB();