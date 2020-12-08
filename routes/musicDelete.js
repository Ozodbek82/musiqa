const express = require("express");
const Music = require("../model/Music");
const router = express.Router();
const fs = require("fs");


/* GET users listing. */
router.get("/delete/:id", function (req, res, next) {
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
  Music.findByIdAndDelete(req.params.id,(err)=>{
      if (err) console.log(err);
      else{      
        res.redirect("/");}
  })
});


module.exports = router;