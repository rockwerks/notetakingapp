// In routes/api.js
router.get('/notes', isLoggedIn, async (req, res) => {
  // Return JSON of user's notes
});


router.post('/notes', isLoggedIn, async (req, res) => {
  // Create note via API
});
