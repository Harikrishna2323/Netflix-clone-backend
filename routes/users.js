const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const verify = require("../utils/verifyToken");

//GET ONE
router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json(user);
  } catch (err) {
    res.status(404).json("User not found.");
  }
});

//GET ALL
router.get("/", verify, async (req, res) => {
  const query = req.query.new;
  console.log("the req.user: ", req.user);
  if (req.user.isAdmin) {
    try {
      const users = query ? await User.find().limit(5) : await User.find();
      console.log(users);
      res.status(200).json(users);
    } catch (err) {
      res.status(404).json("User not found.");
    }
  }
});

//GET USER STATS
router.get("/stats", verify, async (req, res) => {
  const today = new Date();
  const latYear = today.setFullYear(today.setFullYear() - 1);

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.patch("/:id", verify, async (req, res, next) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can update only your account.");
  }
});

//DELETE
router.delete("/:id", verify, async (req, res, next) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json("User has benn deleted.");
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can delete your account only.");
  }
});

module.exports = router;
