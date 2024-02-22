const express = require("express");
const router = express.Router();
const locationModel = require("../Models/location");
const mealsModel = require("../Models/mealType");
const restaurantModel = require("../Models/restaurant");
const menusModel = require("../Models/menu");
const orderModel = require("../Models/order");
const authenticateToken = require("../middleware/authMiddleware");
// const Razorpay = require("razorpay");

// Get all locations
router.get("/location", async function (req, res) {
  try {
    const location = await locationModel.find();
    res.send(location);
  } catch (err) {
    console.log("server error", err);
  }
});

// Find restaurants based on stateId or mealId
router.get("/restaurants", async function (req, res) {
  try {
    let query = {};
    let stateId = +req.query.stateId;
    let mealId = +req.query.mealId;
    if (stateId) {
      query = { state_id: stateId };
    } else if (mealId) {
      query = { "mealTypes.mealtype_id": mealId };
    }
    const restaurant = await restaurantModel.find(query);
    res.send(restaurant);
  } catch (err) {
    console.log("server error", err);
  }
});

// Get all meal types for quick search
router.get("/quicksearch", async function (req, res) {
  try {
    const meals = await mealsModel.find();
    res.send(meals);
  } catch (err) {
    console.log("server error", err);
  }
});

// Filter restaurants based on mealId, cuisineId, and cost range
router.get("/filter/:mealId", async function (req, res) {
  let query = {};
  let mealId = +req.params.mealId;
  let cuisineId = +req.query.cuisineId;
  let lcost = +req.query.lcost;
  let hcost = +req.query.hcost;

  if (mealId) {
    query = { "mealTypes.mealtype_id": mealId };
  }

  if (cuisineId) {
    query = {
      "mealTypes.mealtype_id": mealId,
      "cuisines.cuisine_id": cuisineId,
    };
  } else if (lcost && hcost) {
    query = {
      "mealTypes.mealtype_id": mealId,
      $and: [{ cost: { $gt: lcost, $lt: hcost } }],
    };
  } else if (cuisineId && lcost && hcost) {
    query = {
      "mealTypes.mealtype_id": mealId,
      "cuisines.cuisine_id": cuisineId,
      $and: [{ cost: { $gt: lcost, $lt: hcost } }],
    };
  }

  try {
    const filter = await restaurantModel.find(query);
    res.send(filter);
  } catch (err) {
    console.log("server error", err);
  }
});

// Get details of a specific restaurant by ID
router.get("/restaurants/:id", async function (req, res) {
  let query = {};
  let id = +req.params.id;
  if (id) {
    query = { restaurant_id: id };
  }
  try {
    const details = await restaurantModel.find(query);
    res.send(details);
  } catch (err) {
    console.log("server error", err);
  }
});

// Get all menus
router.get("/menu", async function (req, res) {
  try {
    const menu = await menusModel.find();
    res.send(menu);
  } catch (err) {
    console.log("server error", err);
  }
});

// Get menu for a specific restaurant by ID
router.get("/menu/:id", async function (req, res) {
  let query = {};
  let id = +req.params.id;
  if (id) {
    query = { restaurant_id: id };
  }
  try {
    const menuId = await menusModel.find(query);
    res.send(menuId);
  } catch (err) {
    console.log("server error", err);
  }
});

// Post order for selected menu items
router.post("/menuItem", async function (req, res) {
  if (Array.isArray(req.body)) {
    let menu = await menusModel.find({ menu_id: { $in: req.body } });
    res.send(menu);
  } else {
    res.send("invalid input");
  }
});
// Place an order
router.post("/placeOrder", async function (req, res) {
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
    });
    res.send({ success: true, message: "Order Placed", placeOrder });
  } catch (err) {
    res.send({ success: false, message: "Order not placed", err });
  }
});
// const razorpay = new Razorpay({
//   key_id: "YOUR_RAZORPAY_KEY_ID",
//   key_secret: "YOUR_RAZORPAY_KEY_SECRET",
// });
// router.post("/api/payment/capture", async (req, res) => {
//   const { payment_id, order_id } = req.body;

//   try {
//     const response = await razorpay.payments.capture(payment_id);
//     console.log(response);
//     res.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: "Payment capture failed" });
//   }
// });

// Find order using query method
router.get("/order", authenticateToken, async function (req, res) {
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
});

// Delete order by orderId
router.delete("/delete/:id", async function (req, res) {
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
});

// Update order email by orderId
router.put("/update/:id", async function (req, res) {
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
});

module.exports = router;
