const Razorpay = require("razorpay");
const orderModel = require("../Models/order");
const dotenv = require("dotenv");
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID_KEY,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

async function placeOrder(req, res) {
  try {
    const {
      orderId,
      name,
      email,
      phone,
      address,
      cost,
      restName,
      orderItems,
      uniqueId,
    } = req.body;
    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !cost ||
      !restName ||
      !orderItems ||
      !uniqueId
    ) {
      return res.send({ success: false, message: "All fields are required" });
    }
    const options = {
      amount: cost * 100,
      currency: "INR",
      receipt: "receipt_order_" + Math.floor(Math.random() * 1000),
      payment_capture: 1,
    };
    const razorpayOrder = await razorpay.orders.create(options);
    const placeOrder = await orderModel.create({
      orderId,
      name,
      email,
      phone,
      address,
      cost,
      restName,
      orderItems,
      uniqueId,
      razorpayOrderId: razorpayOrder.id,
    });
    res.send({
      success: true,
      message: "Order Placed",
      orderId: placeOrder.orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: placeOrder.cost,
    });
  } catch (err) {
    res.send({ success: false, message: "Order not placed", err });
  }
}

async function payment(req, res) {
  const { payment_id, order_id, signature } = req.body;

  try {
    const payment = await razorpay.payments.fetch(payment_id);
    const paymentData = {
      order_id,
      amount: payment.amount / 100,
      status: payment.status,
    };
    if (!payment) {
      return res.send({ success: false, message: "payment Failed" });
    }
    res.send({
      success: true,
      message: "Payment Done",
      paymentData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Payment capture failed" });
  }
}

// all orders
async function orders(req, res) {
  let query = {};
  let id = +req.query.id;
  if (id) {
    query = { uniqueId: id };
  }
  try {
    const order = await orderModel.find(query);
    res.send(order);
  } catch (err) {
    console.log("server error", err);
  }
}

// delete orders
async function deleteOrder(req, res) {
  let query = {};
  let id = +req.params.id;
  if (id) {
    query = { orderId: id };
  }
  try {
    const deleteOrder = await orderModel.deleteOne(query);
    res.send({
      success: true,
      message: "Order Delete Successfull",
      deleteOrder,
    });
  } catch (err) {
    res.send({ success: false, message: "server error", err });
  }
}

// update order
async function updateOrder(req, res) {
  let id = +req.params.id;
  try {
    const updateorder = await orderModel.updateOne(
      { orderId: id },
      {
        $set: {
          email: req.body.email,
        },
      }
    );
    res.send(updateorder);
  } catch (err) {
    console.log("server error", err);
  }
}
module.exports = { placeOrder, payment, orders, deleteOrder, updateOrder };
