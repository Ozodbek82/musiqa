const express = require("express");
const Music = require("../model/Music");
const router = express.Router();

/* GET users listing. */
router.get("/:id", function (req, res, next) {
  Music.findById(req.params.id, (err, musics) => {
    console.log(musics);
    res.render("music", {
      title: "Musiqa sahifasi",
      musics,
    });
  });
});



module.exports = router;