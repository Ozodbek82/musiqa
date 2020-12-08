const express = require("express");
const Music = require("../model/Music");
const router = express.Router();
const eA = require("../middleware/eA");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

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
      
    );
  },
});

const upload = multer({ storage: storage });


const cpUpload = upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "audio1", maxCount: 1 },
]);


/* GET users listing. */


router.get("/edit/:id", eA,function (req, res, next) {
  Music.findById(req.params.id, (err, music1) => {
    if(err){
      console.log("edit get da id topishda xato")
    }
    res.render("musicEdit", {
      title: "Musiqa o`zgartirish sahifasi",
      music1,
    });
  });
});
router.post("/edit/:id",cpUpload,(req,res)=>{
  const query={_id:req.params.id};
  Music.findById(query,(err,res)=>{
    fs.unlink("public/uploads/"+res.imageName, (err) => {
      if (err) console.log(err,"eski i faylni o`chirishda xato"); // если возникла ошибка    
      else console.log("oldingi i file o`chiildi ");
    });
    fs.unlink("public/uploads/"+res.audioName, (err) => {
      if (err) console.log(err,"eski a faylni o`chirishda xato"); // если возникла ошибка    
      else console.log("oldingi a file o`chiildi ");
    }); 
  });
  
  
  const music2={};
  // console.log(req.files); 
  music2.name=req.body.name;
  music2.singer=req.body.singer;
  music2.comment=req.body.comment;
  music2.imageName = (JSON.parse(JSON.stringify(req.files)))["image1"][0]["filename"];
  music2.audioName = (JSON.parse(JSON.stringify(req.files)))["audio1"][0]["filename"];
    
  

  Music.update(query,music2,(err)=>{
      if (err) console.log(err);
      res.redirect("/");
  });
});


module.exports = router;