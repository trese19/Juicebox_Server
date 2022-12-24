// checks to see if a user is attached to request
// sends error when there is no user

const requireUser = (req, res, next) => {
  if (!req.user) {
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action"
    });
  }

  next();
}

module.exports = {
  requireUser
}