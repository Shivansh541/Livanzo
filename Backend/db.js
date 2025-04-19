const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/HostelHub"

const connectToMongo = ()=>{
    mongoose.connect(mongoURI)
    console.log("Successfully connected to mongoDB")
}
module.exports = connectToMongo;