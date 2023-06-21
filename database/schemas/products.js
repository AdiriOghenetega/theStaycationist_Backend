const mongoose = require("mongoose");

const schemaProduct = new mongoose.Schema({
  name: String,
  category: String,
  images: Array,
  price: String,
  baths: String,
  rooms: String,
  description: String,
  location: String,
  topSeller: Boolean,
});

module.exports = mongoose.model("product", schemaProduct);
