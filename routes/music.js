const express = require("express");
const Music = require("../model/Music");
const router = express.Router();
const User = require("../model/User");
const eA = require("../middleware/eA");


router.get("/:id", eA, function (req, res, next) {
  
  
  Music.findById(req.params.id, (err, music) => {
    
    User.findById(music.orignUser, (err, user) => {
      // console.log(user._id,musics.orignUser),
      res.render("music", {
        title: "Musiqa sahifasi",
        music,        
        admin:user.name,
      });
      
    });
  });
});



module.exports = router;