function passUserToView(req, res, next) {
  res.locals.user = req.user ? req.user : null
  next()
}

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/auth/google')
}

function isCareGiver(req, res, next) {
  // FIXME Update logic here
  // profile._id.equals(req.user.profile._id)
  if (req.isAuthenticated()) return next()
  res.redirect('/')
}

export {
  passUserToView,
  isLoggedIn,
  isCareGiver
}
