const cloudinary = require("../utils/uploadImage");

//import schema
const productModel = require("../database/schemas/products");
const userModel = require("../database/schemas/user");

const handleProductUpload = async (req, res) => {
  const {
    name,
    category,
    images,
    price,
    description,
    address,
    state,
    country,
    rooms,
    baths,
  } = req.body;
  const { id } = req.params;
  try {
    if (id) {
      //find user with ID and check if user is an admin
      const isAdmin = await userModel.findById(id);
      if (isAdmin && isAdmin.role.toLowerCase() === "admin") {
        if (
          name &&
          category &&
          images &&
          price &&
          description &&
          address &&
          rooms &&
          baths &&
          state &&
          country
        ) {
          const promises = [];

          for (const image of images) {
            const promise = cloudinary.uploader.upload(image, {
              folder: "theStaycationist",
            });
            promises.push(promise);
          }

          Promise.all(promises).then(async (results) => {
            const imageUploads = results.map((el) => el.secure_url);
            const data = await productModel.create({
              name,
              category,
              images: imageUploads,
              price,
              description,
              address,
              state,
              country,
              rooms,
              baths,
              topSeller: false,
            });
            res.send({ message: "Upload successfully", data });
          });
        }
      } else {
        res.send({ message: "only admins can perform this action" });
      }
    } else {
      res.send({ message: "only admins can perform this action" });
    }
  } catch (error) {
    console.error("Error occurred: ", error);
  }
};

const handleGetProduct = async (req, res) => {
  console.log("product api called");
  try {
    const data = await productModel.find();
    console.log("product call answered");
    res.send(JSON.stringify(data));
    console.log("product data sent");
  } catch (error) {
    console.log(error);
  }
};

const handleQueryProduct = async (req, res) => {
  console.log(req.query);
  console.log("product query api called");
  try {
    const data = await productModel.find(req.query);
    // console.log(data)
    console.log("product query call answered");
    res.send(JSON.stringify(data));
    console.log("product query data sent");
  } catch (error) {
    console.log(error);
  }
};

const handleProductDelete = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    if (id) {
      //check if user is admin
      const isAdmin = await userModel.findById(id);
      if (isAdmin && isAdmin.role.toLowerCase() === "admin") {
        //loop through data ,find by id and delete
        if (body) {
          body.forEach(async (elem) => {
            await productModel.findByIdAndDelete(elem.value);
          });
          //find product Db and send
          const productdb = await productModel.find();
          res.send({ data: productdb, message: "product/products deleted" });
        }
      } else {
        res.send({ message: "only admins can perform this action" });
      }
    } else {
      res.send({ message: "only admins can perform this action" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleProductUpload,
  handleGetProduct,
  handleProductDelete,
  handleQueryProduct,
};
