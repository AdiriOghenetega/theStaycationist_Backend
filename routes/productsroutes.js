const { Router } = require("express");
const {
  handleProductUpload,
  handleGetProduct,
  handleProductDelete,
  handleQueryProduct
} = require("../controllers/productctrl");

const router = Router();

//product section

//save product in data
//api
router.post("/uploadProduct/:id", handleProductUpload);

//get product data
router.get("/product", handleGetProduct);

//query product data
router.get("/queryproduct",handleQueryProduct)

router.delete("/deleteproduct/:id", handleProductDelete);

module.exports = router;
