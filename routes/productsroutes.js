const { Router } = require("express");
const {
  handleProductUpload,
  handleGetProduct,
  handleProductDelete,
} = require("../controllers/productctrl");

const router = Router();

//product section

//save product in data
//api
router.post("/uploadProduct/:id", handleProductUpload);

//get product data
router.get("/product", handleGetProduct);


router.delete("/deleteproduct/:id", handleProductDelete);

module.exports = router;
