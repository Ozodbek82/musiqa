const eA = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("danger", "Iltimos tizimga kiring");
    res.redirect("/login");
  }
};  
  
  module.exports = eA;