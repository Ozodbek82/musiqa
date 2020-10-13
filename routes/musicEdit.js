const express = require("express");
const Music = require("../model/Music");
const router = express.Router();

/* GET users listing. */
router.get("/edit/:id", function (req, res, next) {
  Music.findById(req.params.id, (err, musics) => {
    console.log(musics);
    res.render("musicEdit", {
      title: "Musiqa ozgartirish sahifasi",
      musics,
    });
  });
});

router.post("/edit", function (req, res, next) {
  console.log("yangiladik");
});

module.exports = router;