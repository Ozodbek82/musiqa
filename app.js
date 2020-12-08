const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose=require("mongoose");
const multer = require("multer");
const eA = require("./middleware/eA");
// const bodyParser = require("body-parser");
const fs = require("fs");

//routerlar
const indexRouter = require('./routes/index');
const addRouter = require('./routes/musicAdd');
const musicRouter=require("./routes/music");
const editRouter=require("./routes/musicEdit");
const deleteRouter=require("./routes/musicDelete");
const userRouter=require("./routes/users");



const app = express();

//validatorlar ulash
const flash=require('connect-flash');
const validator=require('express-validator');
const session=require('express-session');
const passport = require("passport");

//navigator express-messages
app.use(require('connect-flash')());
app.use(function(req,res,next){
  res.locals.messages=require('express-messages')(req,res);
  next();
});
//express-session
app.use(session({
  secret:'keyboard cat',
  resave:false,
  saveUninitialized:true,
}));
//validation
app.use(validator({errorFormatter:(param,msg,value)=>{
  let namespace=param.split('.'),root=namespace.shift(),formParam=root
  while(namespace.length){
    formParam+='['+namespace.shift()+']';
  }
  return{
    param:formParam,
    msg:msg,
    value:value
  }
}}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const db2=require("./cf/db");

//mongoose ulash jarayoni
mongoose.connect(db2.db,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  useCreateIndex:true,
});

//mongooose
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",function(){console.log("Mongo Dbga global ulandik");});
 //passport js ulash
require("./cf/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/music', addRouter);
app.use('/music', musicRouter);
app.use('/music', editRouter);
app.use('/music', deleteRouter);
app.use('/', userRouter);
// app.use(express.static(path.join(__dirname, 'archive')));


// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

//musicAdd dan ko`chirilgan codlar
// const storage = multer.diskStorage({destination:function(req, file, cb){
//   cb(null, "./archive");
// },
//   filename: function(req, file, cb){
//       var filename = Date.now();
//       switch (file.mimetype) {
//         case 'image/png':
//         filename = filename + ".png";
//         break;
//         case 'image/jpeg':
//         filename = filename + ".jpeg";
//         break;
//         default:
//         break;
//       }
//       cb(null, filename);
//     }}
// );

// let upload = multer({ storage: storage});

// app.get("/music/u/add", eA ,function (req, res, next) {
//   res.render("musicAdd", { title: "Upload your music" });
// });
// app.post("/music/u/add", eA,upload.fields([{name:"image1"},{name:"audio1"}]), function (req, res, next) {
//   req.checkBody("name", "Please write music").notEmpty();
//   req.checkBody("singer", "Please write singer ").notEmpty();
//   req.checkBody("comment", "Please write comments").notEmpty();
//   const errors = req.validationErrors();
//   // upload.single("image1")
//   //upload.fields([{name:'image1'}])
//   if (errors) {
//     res.render("musicAdd", {
//       title: " Adding of the music with some errors",
//       errors: errors,
//     });
//   } else {
//     const music = new Music();
//     music.name = req.body.name;
//     music.singer = req.body.singer;
//     music.comment = req.body.comment;
//     music.orignUser = req.user._id;
//     // music.image=req.body.image1;
//     // music.audio=req.body.audio1;
//     let image = req.body.image1;
//     if(!image)
//         console.log("Ошибка при загрузке файла");
//     else
//         console.log("Файл загружен",image);

//     // console.log(image1, audio1);
//     music.imageName = path.basename(req.body.image1);
//     music.audioName = path.basename(req.body.audio1);
//     //openDownloadStream
//     music.save((err) => {
//       if (err) console.log(err);
//       else {
//         req.flash("success", "  Music  Added  ");
//         res.redirect("/");
//       }
//     });
//   }
// });

// shu yerda ko`chirilgan codlar tugaydi


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
