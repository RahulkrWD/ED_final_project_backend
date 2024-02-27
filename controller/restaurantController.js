const locationModel = require("../Models/location");
const restaurantModel = require("../Models/restaurant");
const mealsModel = require("../Models/mealType");
const menusModel = require("../Models/menu");

// location
async function location(req, res) {
  try {
    const location = await locationModel.find();
    res.send(location);
  } catch (err) {
    console.log("server error", err);
  }
}
// restaurant
async function restaurant(req, res) {
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
}

// quicksearch
async function quicksearch(req, res) {
  try {
    const meals = await mealsModel.find();
    res.send(meals);
  } catch (err) {
    console.log("server error", err);
  }
}

// filter
async function filter(req, res) {
  let query = {};
  let mealId = +req.params.mealId;
  let cuisineId = +req.query.cuisineId;
  let lcost = +req.query.lcost;
  let hcost = +req.query.hcost;
  let sort = req.query.sort;

  // filter by mealId
  if (mealId) {
    query = { "mealTypes.mealtype_id": mealId };
  }

  // filter by cuisineId
  if (cuisineId) {
    query = {
      "mealTypes.mealtype_id": mealId,
      "cuisines.cuisine_id": cuisineId,
    };
  }
  // range filter by lcost to hcost
  if (lcost && hcost) {
    query = { cost: { $gt: lcost, $lt: hcost } };
  }

  // filter cuisineid && lcost && hcost
  if (cuisineId && lcost && hcost) {
    query = {
      "cuisines.cuisine_id": cuisineId,
      $and: [{ cost: { $gt: lcost, $lt: hcost } }],
    };
  }

  // sort filter
  const sortOptions = {
    asc: { cost: 1 },
    desc: { cost: -1 },
  };

  const sortQuery = sortOptions[sort] || {};

  try {
    const filter = await restaurantModel.find(query).sort(sortQuery);
    res.send(filter);
  } catch (err) {
    console.log("server error", err);
  }
}

// resturant filter by id
async function restaurantId(req, res) {
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
}

// menu
async function menu(req, res) {
  try {
    const menu = await menusModel.find();
    res.send(menu);
  } catch (err) {
    console.log("server error", err);
  }
}

// menu filter by id
async function menuId(req, res) {
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
}

// post menuitems
async function menuItems(req, res) {
  if (Array.isArray(req.body)) {
    let menu = await menusModel.find({ menu_id: { $in: req.body } });
    res.send(menu);
  } else {
    res.send("invalid input");
  }
}
module.exports = {
  location,
  restaurant,
  quicksearch,
  filter,
  restaurantId,
  menu,
  menuId,
  menuItems,
};
