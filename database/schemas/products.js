const mongoose = require("mongoose")

const schemaProduct =new mongoose.Schema({
    name: String,
    category:String,
    image: String,
    images:String,
    price: String,
    baths: String,
    rooms: String,
    description: String,
    location : String,
    topSeller : Boolean
  });


  module.exports = mongoose.model("product",schemaProduct)