var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose =  require('mongoose');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

mongoose.connect('mongodb://localhost/PatriotPangan');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var Token  = require(__dirname + '/controllers/Token.controller');
var PejabatsRouter = require(__dirname + '/routes/Pejabats.route');
var AuthRouter = require(__dirname + '/routes/Auth.route');
var AdminRouter = require(__dirname + '/routes/Admin.route');
var PatriotsRouter = require(__dirname + '/routes/Patriots.route');
var ArtikelsRouter = require(__dirname + '/routes/Artikel.route');

app.use('/auth', AuthRouter);
// Checking token gajadi pake ini
// Kudu make, untuk memastikan yang login punya token dari kita
app.use((req, res, next) => {
	if(!req.headers.token) {
		// Cant find token
    res.status(200)
      .json({
        status: false, 
        message: "Sorry we can't find your token, please make new request"
      });
	} else {
		Token.CheckingToken(req.headers.token, res, next);
		next();
	}
});
app.use('/admin', AdminRouter);
app.use('/patriot', PatriotsRouter);
app.use('/artikel', ArtikelsRouter);

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
