const userModel = require("../Models/newUser");

// profile
async function profile(req, res) {
  let query = {};
  let id = +req.params.id;
  if (id) {
    query = { uniqueId: id };
  }
  const profile = await userModel.findOne(query);
  res.send(profile);
}

async function updateProfile(req, res) {
  let query = {};
  let id = +req.params.id;
  if (id) {
    query = { uniqueId: id };
  }
  try {
    const updateProfile = await userModel.updateOne(query, {
      $set: {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      },
    });
    res.send({ success: true, message: "Update successfull", updateProfile });
  } catch (err) {
    res.send({ success: false, message: "user Update failed", err });
  }
}
module.exports = { profile, updateProfile };
