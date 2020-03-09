/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
//var networksRouter = require('./routes/networks');
var chainRouter = require('./routes/chain');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.param('chainid', function(req, res, next, val) {
  console.log('chainid');
  res.locals.chainid = val;
  next();
});

app.use('/', indexRouter);
//app.use('/networks', networksRouter);
app.use('/chain/:chainid([a-zA-Z0-9-]+)', chainRouter);

module.exports = app;
