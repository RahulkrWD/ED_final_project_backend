const express = require("express");
const router = express.Router();
const restaurantController = require("../controller/restaurantController");
const placeOrderController = require("../controller/placeOrderController");

router.get("/location", restaurantController.location);
router.get("/restaurants", restaurantController.restaurant);
router.get("/quicksearch", restaurantController.quicksearch);
router.get("/filter/:mealId", restaurantController.filter);
router.get("/restaurants/:id", restaurantController.restaurantId);
router.get("/menu", restaurantController.menu);
router.get("/menu/:id", restaurantController.menuId);
router.post("/menuItem", restaurantController.menuItems);
router.post("/placeOrder", placeOrderController.placeOrder);
router.post("/payment/capture", placeOrderController.payment);
router.get("/order", placeOrderController.orders);
router.delete("/delete/:id", placeOrderController.deleteOrder);
router.put("/update/:id", placeOrderController.updateOrder);

module.exports = router;
