/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const db = require('../db/db');
const appConfig = require('../models/app_config');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  appConfig.getLast(chain_id)
    .then((row) => {
      res.status(200);
      res.send(row);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

module.exports = router;
