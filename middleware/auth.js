function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/dashboard');
}


module.exports = { isLoggedIn };