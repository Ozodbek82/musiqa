const express = require("express");
const multer = require("multer");
const Music = require("../model/Music");
const router = express.Router();
const crypto = require("crypto");
const mongoose = require("mongoose");
const path = require("path");
const eA = require("../middleware/eA");
const fs = require("fs");
const db2 = require("../cf/db");
const bodyParser = require("body-parser");

router.use(express.json());
router.use(express.static(__dirname));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname.slice(0,(file.originalname.length-path.extname(file.originalname).length)) + "-" + Date.now() + path.extname(file.originalname)
      // file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// const upload = multer({ dest: "uploads/" });
const cpUpload = upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "audio1", maxCount: 1 },
]);

router.get("/add/add", eA, function (req, res, next) {
  res.render("musicAdd", { title: "Upload your music" });
});

router.post("/add/add", eA, cpUpload, function (req, res, next) {
  req.checkBody("name", "Please write music").notEmpty();
  req.checkBody("singer", "Please write singer ").notEmpty();
  req.checkBody("comment", "Please write comments").notEmpty();
  const errors = req.validationErrors();
  if (errors) {
    res.render("musicAdd", {
      title: " Adding of the music with some errors",
      errors: errors,
    });
  } else {
    const music = new Music();
    music.name = req.body.name;
    music.singer = req.body.singer;
    music.comment = req.body.comment;
    music.orignUser = req.user._id;
    // console.log(req.files);
    // const obj = JSON.parse(JSON.stringify(req.files)); // req.body = [Object: null prototype] { title: 'product' }
    // const img=obj.image1;
    // const img_obj=img[0];
    // console.log(img_obj.filename);
    // console.log("bu qisqarogi",(JSON.parse(JSON.stringify(req.files)))["image1"][0]["filename"])
    // { title: 'product' }    
    music.imageName = (JSON.parse(JSON.stringify(req.files)))["image1"][0]["filename"];
    music.audioName = (JSON.parse(JSON.stringify(req.files)))["audio1"][0]["filename"];
    music.save((err) => {
      if (err) console.log(err);
      else {
        req.flash("success", "  Music  Added  ");
        res.redirect("/");
      }
    });
  }
});

module.exports = router;
