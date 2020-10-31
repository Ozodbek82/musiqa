const express = require("express");

const User = require("../model/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/registr", function (req, res, next) {
  res.render("registr", { title: "Sign up it`s free" });
});

router.post("/registr", function (req, res, next) {
  req.checkBody("name", "Please enter your name").notEmpty();
  req.checkBody("username", "Please enter your Username").notEmpty();
  req.checkBody("email", "Please enter your E-MAIL").notEmpty();
  req.checkBody("password", "Please enter your Password").notEmpty();
  req
    .checkBody("password2", "Please confirm your password")
    .equals(req.body.password);
  const errors = req.validationErrors();

  if (errors) {
    res.render("registr", { errors: errors });
  } else {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    const newUser = new User({
      name: name,
      username: username,
      email: email,
      password: password,
    });
    bcrypt.genSalt(10, (err, pass) => {
      bcrypt.hash(newUser.password, pass, (err, hash) => {
        if (err) console.log(err);
        newUser.password = hash;
        newUser.save((err) => {
          if (err) console.log(err);
          else {
            req.flash("success", "Ro`yhatdan o`tdingiz");
            res.redirect("/login");
          }
        });
      });
    });
  }
});

router.get("/login", function (req, res, next) {
  res.render("login", { title: "Saytga kirish" });
});
router.post("/login", function (req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", function (req, res, next) {
  req.logout();
  req.flash("success", "Tizimdan chiqdingiz");
  res.redirect("/login");
});
module.exports = router;
