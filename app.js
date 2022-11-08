var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require("express-fileupload");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var batchesRouter = require('./routes/batches.js');
var otpRouter = require('./routes/otp')
var arenasRouter = require('./routes/arenas.js');
var coachRouter = require('./routes/coaches')
var academiesRouter = require('./routes/academies.js');
var sportsRouter = require('./routes/sports.js');
var reviewRouter = require('./routes/reviews.js');
var sportsRouter = require('./routes/sports.js');
var planRouter = require('./routes/plans')

var app = express();
app.use(fileUpload());
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/batches', batchesRouter);
app.use('/notifications/otp', otpRouter);
app.use('/coach', coachRouter);
app.use('/arenas', arenasRouter);
app.use('/academies', academiesRouter);
app.use('/sports', sportsRouter);
app.use('/reviews',reviewRouter);
app.use('/sports',sportsRouter);
app.use('/plans',planRouter)
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
