var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./HJ_index');
var usersRouter = require('./routes/HJ_users');

var HJ_app = express();

// view engine setup
HJ_app.set('views', path.join(__dirname, 'views'));
HJ_app.set('view engine', 'pug');

HJ_app.use(logger('dev'));
HJ_app.use(express.json());
HJ_app.use(express.urlencoded({ extended: false }));
HJ_app.use(cookieParser());
HJ_app.use(express.static(path.join(__dirname, 'public')));

HJ_app.use('/', indexRouter);
HJ_app.use('/HJ_users', usersRouter);

// catch 404 and forward to error handler
HJ_app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
HJ_app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = HJ_app;
