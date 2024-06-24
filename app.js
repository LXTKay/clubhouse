require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const session = require("express-session");


const indexRouter = require('./routes/index');
const signUpRouter = require('./routes/signUp');

const app = express();

mongoose.connect(process.env.DBURL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));



//Generic Middleware:-----------------------------------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DBURL,
    collection: "sessions"
  }),
  cookie: {maxAge: 1000 * 60 * 60 * 24}
}));

require("./config/authentication");


//Routes:-----------------------------------------------------------

app.use('/', indexRouter); //-> Mesaage, Login, Landing
app.use('/signUp', signUpRouter);


//Errors:------------------------------------------------------------

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
