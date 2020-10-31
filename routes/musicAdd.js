const express = require("express");
const Music = require("../model/Music");
const router = express.Router();

/* GET users listing. */
router.get("/add", function (req, res, next) {
  res.render("musicAdd", { title: "Upload your music" });
});

router.post("/add", function (req, res, next) {
  req.checkBody('name','Please write music').notEmpty()
  req.checkBody('singer','Please write singer ').notEmpty()
  req.checkBody('comment','Please write comments').notEmpty()
  const errors=req.validationErrors();
  if (errors){
    res.render('musicAdd',{title:" Adding of the music with some errors",errors:errors})
  }
  else{
    const music = new Music();
    music.name = req.body.name;
    music.singer = req.body.singer;
    music.comment = req.body.comment;

    music.save((err)=> {
      if(err) console.log(err);
      else{
        req.flash('success',"  Music  Added  ")
        res.redirect('/')
      }
    });
  }
  
});

module.exports = router;
