const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");
const Note = require("../models/noteSchema");

// Return JSON of user's notes
router.get("/notes", isLoggedIn, async (req, res) => {
  const notes = await Note.find({
    owner: req.user.id,
  }).sort({ createdAt: -1 });
  console.log(notes);
  res.json(notes);
});

// Create note via API
router.post("/notes", isLoggedIn, async (req, res) => {
  console.log(req.body);
  try {
    const newNote = new Note({
      owner: req.user.id,
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
    });
    await newNote.save();
  } catch (error) {
    console.log(error);
  }
  res.json({status: 'OK'});
});

module.exports = router;
