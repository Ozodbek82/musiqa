var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose=require("mongoose");



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
