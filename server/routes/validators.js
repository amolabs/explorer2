/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const account = require('../models/account');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  account.getList(chain_id, true, from, num)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200);
        res.send(rows);
      } else {
        res.status(404);
        res.send('not found');
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

router.get('/:address([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  account.getOneByValidator(chain_id, req.params.address)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200);
        res.send(rows[0]);
      } else {
        res.status(404);
        res.send('not found');
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

module.exports = router;
