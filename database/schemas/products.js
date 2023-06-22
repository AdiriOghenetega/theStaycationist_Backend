const mongoose = require("mongoose");

const schemaProduct = new mongoose.Schema({
  name: String,
  category: String,
  images: Array,
  price: String,
  baths: String,
  rooms: String,
  description: String,
  address: String,
  state: String,
  country: String,
  topSeller: Boolean,
});

module.exports = mongoose.model("product", schemaProduct);
