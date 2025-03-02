const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const adminAuth = require("../../middleware/adminAuth");
const Ticket = require("../../models/Ticket");
const { check, validationResult } = require("express-validator");
const createCsvStringifier = require("csv-writer").createObjectCsvStringifier;

// @route   GET api/tickets
// @desc    Get all tickets (admin) or user's tickets
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    let tickets;
    if (req.user.role === "admin") {
      tickets = await Ticket.find()
        .populate("user", ["name", "email"])
        .populate("assignedTo", ["name", "email"])
        .sort({ createdAt: -1 });
    } else {
      tickets = await Ticket.find({ user: req.user.id })
        .populate("assignedTo", ["name", "email"])
        .sort({ createdAt: -1 });
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
      check("subject", "Subject is required").not().isEmpty(),
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
      const { subject, description, category, priority } = req.body;

      const newTicket = new Ticket({
        subject,
        description,
        category,
        priority: priority || "medium",
        user: req.user.id,
      });

      const ticket = await newTicket.save();
      await ticket.populate("user", ["name", "email"]);

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
router.patch("/:id/status", [auth, adminAuth], async (req, res) => {
  try {
    const { status } = req.body;

    if (!["open", "in_progress", "resolved", "closed"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ msg: "Ticket not found" });
    }

    ticket.status = status;
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   DELETE api/tickets/:id
// @desc    Delete a ticket
// @access  Private (Admin only)
router.delete("/:id", [auth, adminAuth], async (req, res) => {
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
router.get("/export", [auth, adminAuth], async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("user", ["name", "email"])
      .populate("assignedTo", ["name", "email"]);

    const csvStringifier = createCsvStringifier({
      header: [
        { id: "id", title: "Ticket ID" },
        { id: "subject", title: "Subject" },
        { id: "status", title: "Status" },
        { id: "priority", title: "Priority" },
        { id: "category", title: "Category" },
        { id: "user", title: "Created By" },
        { id: "assignedTo", title: "Assigned To" },
        { id: "createdAt", title: "Created At" },
        { id: "lastUpdated", title: "Last Updated" },
      ],
    });

    const records = tickets.map((ticket) => ({
      id: ticket._id,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
      user: ticket.user.email,
      assignedTo: ticket.assignedTo ? ticket.assignedTo.email : "Unassigned",
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
