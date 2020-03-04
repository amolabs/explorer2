/* vim: set sw=2 ts=2 expandtab : */
var config = require('../config');
var mysql = require('mysql');

var param = config.db;
var conn = mysql.createConnection(param);
conn.connect((err) => {
  if (err) {
    console.log('DB connection failed.');
    throw err;
  } else {
    console.log('DB connected.');
  }
});

module.exports = conn;
