const express = require("express");
const Music = require("../model/Music");
const router = express.Router();

/* GET users listing. */
router.get("/delete/:id", function (req, res, next) {
  Music.findByIdAndDelete(req.params.id,(err)=>{
      if (err) console.log(err);
      else{res.redirect("/");}
  })
});


module.exports = router;