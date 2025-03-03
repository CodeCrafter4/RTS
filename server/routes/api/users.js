const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");

// @route   GET api/users
// @desc    Get all users (admin only)
// @access  Private
router.get("/", [auth, isAdmin], async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/users/:id
// @desc    Update user (admin only)
// @access  Private
router.put(
  "/:id",
  [
    auth,
    isAdmin,
    [
      check("username", "Username is required").not().isEmpty(),
      check("email", "Please include a valid email").isEmail(),
      check("role", "Role must be either 'user' or 'admin'").isIn([
        "user",
        "admin",
      ]),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const { username, email, role } = req.body;

      user.username = username;
      user.email = email;
      user.role = role;

      await user.save();
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/users/:id
// @desc    Delete user (admin only)
// @access  Private
router.delete("/:id", [auth, isAdmin], async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.remove();
    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
