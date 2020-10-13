var express = require('express');
const Music=require("../model/Music");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  Music.find({},(err,musics)=>{
    if(err) console.log(err);
    else{
      res.render("index",{title:"Bosh sahifa",musics});
    }
  })
 
});

module.exports = router;
