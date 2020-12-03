/* vim: set sw=2 ts=2 expandtab : */
const config = require('../../../db/config');
const mysql = require('mysql');

if (config.db === undefined) {
  throw new Error('db field is missing in config.json');
}
if (config.db.collector === undefined) {
  throw new Error('db.collector is missing in config.json');
}
if (config.db.builder === undefined) {
  throw new Error('db.builder is missing in config.json');
}
if (config.db.nodes === undefined) {
  throw new Error('db.nodes is missing in config.json');
}

const params = { timezone: 'UTC' };
//param.supportBigNumbers = true;
//param.bigNumberStrings = true;
const cParam = Object.assign(config.db.collector, params);
const bParam = Object.assign(config.db.builder, params);
const nParam = Object.assign(config.db.nodes, params);

const cPool = mysql.createPool(cParam);
const bPool = mysql.createPool(bParam);
const nPool = mysql.createPool(nParam);
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
  cPool: cPool,
  bPool: bPool,
  nPool: nPool
};
