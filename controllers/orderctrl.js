//import schemas
const userModel = require("../database/schemas/user");
const orderModel = require("../database/schemas/order");
const guestModel = require("../database/schemas/guest");
const productModel = require("../database/schemas/products");

const handleGetOrders = async (req, res) => {
  console.log("getting orders");

  try {
    //query db and return order list
    const orderList = await orderModel
      .find()
      .populate("user")
      .populate("guest");

    if (!orderList) {
      res.send({ message: "No Orders listed" });
    } else {
      //send orderList to client as response
      res.send({ data: orderList });
      console.log("orders sent");
    }
  } catch (error) {
    console.log(error);
  }
};

const handleCreateOrder = async (req, res) => {
  const {
    amount,
    userID,
    userType,
    guest,
    method,
    payment_status,
    order_status,
    reference,
    cartData,
  } = req.body;
  try {
    if (userType === "registered") {
      if (
        amount &&
        userID &&
        method &&
        payment_status &&
        order_status &&
        cartData &&
        reference
      ) {
        //check for user
        const userExists = await userModel.findById(userID);
        if (userExists) {
          //create/store order in db
          const orderdb = await orderModel.create({
            user: userID,
            paymentMethod: method,
            paymentStatus: payment_status,
            orderStatus: order_status,
            transactionReference: reference,
            amount,
            cart: cartData,
          });

          //find products from cartData and add booked days to book
          for (const cartItem of cartData) {
            console.log(cartItem._id);
            await productModel.findByIdAndUpdate(
              cartItem._id,
              { $push: { booked: cartItem.date.value } },
              { new: true }
            );
          }

          res.send(orderdb);
        } else {
          res.send({ message: "user does not exist" });
        }
      } else {
        res.send({ message: "incomplete required details" });
      }
    } else if (userType === "guest") {
      if (
        amount &&
        guest &&
        method &&
        payment_status &&
        order_status &&
        cartData &&
        reference
      ) {
        //check for guest
        const guestExists = await guestModel.findOne({ email: guest.email });
        if (guestExists) {
          //create/store order in db
          const orderdb = await orderModel.create({
            guest: guestExists._id,
            paymentMethod: method,
            paymentStatus: payment_status,
            orderStatus: order_status,
            transactionReference: reference,
            amount,
            cart: cartData,
          });
          res.send(orderdb);
        } else {
          //create guest in db
          const { firstName, lastName, email, mobile, address } = guest;
          const newGuest = await guestModel.create({
            firstName,
            lastName,
            mobile,
            email,
            address,
          });

          //now create order in db
          const orderdb = await orderModel.create({
            guest: newGuest._id,
            paymentMethod: method,
            paymentStatus: payment_status,
            orderStatus: order_status,
            transactionReference: reference,
            amount,
            cart: cartData,
            address: address,
          });
          res.send(orderdb);
        }
      } else {
        res.send({ message: "incomplete required details" });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const handleUpdateOrderStatus = async (req, res) => {
  console.log("update order called");
  const { orderStatus } = req.body;
  const { user_id, order_id } = req.query;
  try {
    if (user_id && order_id) {
      //find user with ID and check if user is an admin
      const isAdmin = await userModel.findById(user_id);
      if (isAdmin && isAdmin.role.toLowerCase() === "admin") {
        //find order with id and update status
        await orderModel.findByIdAndUpdate(
          order_id,
          { orderStatus: orderStatus },
          { new: true }
        );
        //find order Db
        const orderdb = await orderModel.find();
        res.send({ data: orderdb });
        console.log("updated order sent");
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

const handleOrderPaymentStatus = async (req, res) => {
  console.log("update order payment called");
  const { paymentStatus } = req.body;
  const { transactionReference } = req.query;
  try {
    if (transactionReference) {
      //find order with transactionReference
      orderModel.updateOne(
        { transactionReference: transactionReference },
        { $set: { paymentStatus: paymentStatus } }
      );

      //find order Db
      const orderdb = await orderModel.find();
      res.send({ data: orderdb });
      console.log("updated order sent");
    } else {
      res.send({ message: "order id not recognised" });
    }
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteOne = async (req, res) => {
  const { user_id, order_id } = req.query;
  try {
    if (user_id && order_id) {
      //find user with ID and check if user is an admin
      const isAdmin = await userModel.findById(user_id);
      if (isAdmin && isAdmin.role.toLowerCase() === "admin") {
        //find order with id and delete
        await orderModel.findByIdAndDelete(order_id);

        //find order Db and send
        const orderdb = await orderModel.find();
        res.send({ data: orderdb });
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

const handleDeleteAll = async (req, res) => {
  const { id } = req.params;
  try {
    if (id) {
      //find user with ID and check if user is an admin
      const isAdmin = await userModel.findById(id);
      if (isAdmin && isAdmin.role.toLowerCase() === "admin") {
        await orderModel.deleteMany({});
        //find order Db and send
        const orderdb = await orderModel.find();
        res.send({ data: orderdb });
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
  handleGetOrders,
  handleCreateOrder,
  handleUpdateOrderStatus,
  handleOrderPaymentStatus,
  handleDeleteOne,
  handleDeleteAll,
};
