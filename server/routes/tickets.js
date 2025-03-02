const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const { auth, isAdmin } = require("../middleware/auth");

// Create a new ticket (authenticated users)
router.post("/", auth, async (req, res) => {
  try {
    const ticket = new Ticket({
      ...req.body,
      createdBy: req.user._id,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get tickets (users see their own, admins see all)
router.get("/", auth, async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { createdBy: req.user._id };
    const tickets = await Ticket.find(query)
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific ticket
router.get("/:id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    // Check if user has permission to view this ticket
    if (
      req.user.role !== "admin" &&
      ticket.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ticket status (admin only)
router.put("/:id", auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    ticket.status = status;
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
