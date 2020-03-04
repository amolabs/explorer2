/* vim: set sw=2 ts=2 expandtab : */
const fs = require('fs');

const configJson = fs.readFileSync('config.json');
const config = JSON.parse(configJson);
console.log(JSON.stringify(config));

module.exports = config;
