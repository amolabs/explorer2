/* vim: set sw=2 ts=2 expandtab : */
const config = require('../../../db/config');
const mysql = require('mysql');

let param = config.db;
param.timezone = 'UTC';
const dbs = Object.assign({}, param['dbs']);
delete param['dbs'];
//param.supportBigNumbers = true;
//param.bigNumberStrings = true;
const db = mysql.createPool(param);
/*
conn.connect((err) => {
  if (err) {
    console.log('DB connection failed.');
    throw err;
  } else {
    console.log('DB connected.');
  }
});
*/

module.exports = {
  db: db,
  dbs: dbs
};
