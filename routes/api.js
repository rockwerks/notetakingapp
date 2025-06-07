const express = require('express');
const router = express.Router();

router.get('/notes', isLoggedIn, async (req, res) => {
  try {
    // Get user ID from authenticated session
    const userId = req.user.id;
    
    // Query parameters for filtering and pagination
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      search = ''
    } = req.query;
    
    const skip = (page - 1) * limit;
    
    // Build query object
    const query = { userId };
    
    // Add search functionality if search term provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination and sorting
    const notes = await Note.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v'); // Exclude version field
    
    // Get total count for pagination info
    const totalNotes = await Note.countDocuments(query);
    const totalPages = Math.ceil(totalNotes / limit);
    
    res.json({
      success: true,
      data: notes,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalNotes,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/notes', isLoggedIn, async (req, res) => {
  try {
    // Extract note data from request body
    const { title, content, tags = [], category = 'general' } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required',
        errors: {
          title: !title ? 'Title is required' : undefined,
          content: !content ? 'Content is required' : undefined
        }
      });
    }
    
    // Additional validation
    if (title.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Title must be 200 characters or less'
      });
    }
    
    if (content.length > 10000) {
      return res.status(400).json({
        success: false,
        message: 'Content must be 10,000 characters or less'
      });
    }
    
    // Create new note
    const newNote = new Note({
      title: title.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags.map(tag => tag.trim()).filter(Boolean) : [],
      category: category.trim(),
      userId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Save to database
    const savedNote = await newNote.save();
    
    // Return created note (excluding sensitive fields)
    const noteResponse = savedNote.toObject();
    delete noteResponse.__v;
    
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: noteResponse
    });
    
  } catch (error) {
    console.error('Error creating note:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = {};
      Object.keys(error.errors).forEach(key => {
        validationErrors[key] = error.errors[key].message;
      });
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create note',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;