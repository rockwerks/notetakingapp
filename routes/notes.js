const express = require('express');
const passport = require('passport');
const router = express.Router();
const Note = require('../models/noteSchema');
const { ObjectId } = require('mongodb');
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
      owner: req.user.id,
      title: req.body.title,
      content: req.body.content
    })
    await newNote.save();
  } catch (error) {
console.log(error)
  }
})


router.get('/:id', isLoggedIn, async (req, res) => {
  const notes = await Note.findById(req.params.userID)
  res.render(':id', {notes, user: req.user})
  try {
    const note = await Note.findByID(req.params.id);
  } catch (error) {
    console.log("error");
  }
  // Get a specific note
});

router.get('/:id/edit', isLoggedIn, async (req, res) => {
   let getNote = undefined;
  try {
    getNote = await Note.findById(req.params.id)
    } catch (error) {
      console.log(error);
      return;
    }
    res.render('edit', {user: req.user, noteID: req.params.id, note: getNote, category: getNote.category})
  }
)
  // Show edit form

router.post('/update/:id', isLoggedIn, async (req, res) => {
 
  try {
    console.log(req.params.id, req.body)
    const { title, content, category } = req.body
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true }
    )
    // console.log(updatedNote)
    res.redirect('/notes')
  } catch (error) {
    console.log("error")
  }
});


router.post('/:id/delete', isLoggedIn, async (req, res) => {
  try {
   console.log(req.params.id)
   await Note.findByIdAndDelete(req.params.id)
    // const deleteNote = await Note.findByIdAndDelete
    res.redirect('/notes')
  } catch (error) {
    console.log("error")
  }
  // Delete note
});

router.get('/category/:category', isLoggedIn, async (req, res) => {
  try {
    const category = req.params.body;
    
    // Query notes by category for the logged-in user
    const notes = await Note.find(category).sort({ createdAt: -1 }); // Sort by newest first
    res.render('notes/category');
 
  } catch (error) {
    console.error('Error fetching notes by category:', error);
    res.status(500).render('error', { 
      message: 'Error loading category notes' 
    });
  }
});


module.exports = router;