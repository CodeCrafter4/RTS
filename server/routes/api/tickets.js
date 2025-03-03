const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../../middleware/auth");
const Ticket = require("../../models/Ticket");
const { check, validationResult } = require("express-validator");
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;
const User = require("../../models/User");

// @route   GET api/tickets
// @desc    Get all tickets (admin) or user's tickets
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    let tickets;

    if (user.role === "admin") {
      tickets = await Ticket.find().populate("createdBy", "username email");
    } else {
      tickets = await Ticket.find({ createdBy: req.user.id }).populate(
        "createdBy",
        "username email"
      );
    }

    res.json(tickets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/tickets
// @desc    Create a ticket
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
      check("category", "Category is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, category, priority, status } = req.body;

      const newTicket = new Ticket({
        title,
        description,
        category,
        priority: priority || "medium",
        status: status || "open",
        createdBy: req.user.id,
      });

      const ticket = await newTicket.save();
      await ticket.populate("createdBy", "username email");

      res.json(ticket);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PATCH api/tickets/:id/status
// @desc    Update ticket status
// @access  Private (Admin only)
router.patch("/:id/status", [auth, isAdmin], async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    ticket.status = req.body.status;
    await ticket.save();
    await ticket.populate("createdBy", "username email");
    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/tickets/:id
// @desc    Delete a ticket
// @access  Private (Admin only)
router.delete("/:id", [auth, isAdmin], async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    await ticket.remove();

    res.json({ msg: "Ticket removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/tickets/export
// @desc    Export tickets to CSV
// @access  Private (Admin only)
router.get("/export", [auth, isAdmin], async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("createdBy", [
      "username",
      "email",
    ]);

    const csvStringifier = createCsvStringifier({
      header: [
        { id: "id", title: "Ticket ID" },
        { id: "title", title: "Title" },
        { id: "status", title: "Status" },
        { id: "priority", title: "Priority" },
        { id: "category", title: "Category" },
        { id: "createdBy", title: "Created By" },
        { id: "createdAt", title: "Created At" },
        { id: "lastUpdated", title: "Last Updated" },
      ],
    });

    const records = tickets.map((ticket) => ({
      id: ticket._id,
      title: ticket.title,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      createdBy: ticket.createdBy.email,
      createdAt: ticket.createdAt,
      lastUpdated: ticket.lastUpdated,
    }));

    const csvString = csvStringifier.stringifyRecords(records);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=tickets.csv");
    res.send(csvString);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/tickets/:id/comments
// @desc    Add a comment to a ticket
// @access  Private
router.post(
  "/:id/comments",
  [auth, [check("text", "Comment text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        return res.status(404).json({ msg: "Ticket not found" });
      }

      const newComment = {
        text: req.body.text,
        user: req.user.id,
      };

      ticket.comments.unshift(newComment);
      await ticket.save();

      res.json(ticket.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
