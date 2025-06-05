const express = require('express');
const passport = require('passport');
const router = express.Router();
const Note = require('../models/noteSchema');
const { isLoggedIn } = require('../middleware/auth');

router.get('/', isLoggedIn, async (req, res) => {
try {
  const notes = await Note.find({ owner: req.user.id});
  res.render('index', {notes, user: req.user});
  } catch (error) {
    res.status(500).json({message: error.message});
   
  }
  });

router.get('/new', isLoggedIn, async (req, res) => {
   try {
    res.render('new',{user: req.user});
  } catch (error) {
    res.status(400).json.apply({message: error.message})
  } ;
  }
 // Create a new note
);

router.post('/new', isLoggedIn, async (req, res) => {
  try {
    res.redirect('/notes/')
     const newNote = new Note({
      title: req.body.title,
      content: req.body.content
    })
    await newNote.save();
  } catch (error) {
console.log(error)
  }
})


router.get('/:id', isLoggedIn, async (req, res) => {
  res.send(':id', {notes, user: req.user})
  try {
    const note = await Note.findByID(req.params.id);
  } catch (error) {
    console.log("error");
  }
  // Get a specific note
});


router.get('/:id/edit', isLoggedIn, async (req, res) => {
  res.send(':id/edit', {notes, user: req.user})
  try {
    const editNote = await Note.findByIdAndUpdate(req.params.id);
    } catch (error) {
      console.log("error");
    }
  }
)
  // Show edit form

router.put('/update/:id', isLoggedIn, async (req, res) => {
  res.send('update', {notes, user: req.user})
  try {
    const updateNote = await Note.findByIdAndUpdate
  } catch (error) {
    console.log("error")
  }
});


router.delete('/:id', isLoggedIn, async (req, res) => {
  res.delete('delete', {notes, user: req.user})
  try {
    const deleteNote = await Note.findByIdAndDelete
  } catch (error) {
    console.log("error")
  }
  // Delete note
});



module.exports = router;