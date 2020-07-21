/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const penalty = require('../models/penalty');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  penalty.getList(chain_id, from, num)
    .then((rows) => {
      if (rows) {
        res.status(200);
        res.send(rows);
      } else {
        res.status(400);
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
  const address = req.params.address;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  penalty.getListByAddress(chain_id, address, from, num)
    .then((rows) => {
      if (rows) {
        res.status(200);
        res.send(rows);
      } else {
        res.status(404);
        res.send('not found')
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

module.exports = router;
