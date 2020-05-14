/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const node = require('../models/node');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  node.getList(chain_id, from, num)
    .then((row) => {
      res.status(200);
      res.send(row);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

router.get('/:node_id([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  node.getOne(chain_id, req.params.node_id)
    .then((row) => {
      if (row) {
        res.status(200);
        res.send(row);
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

router.get('/:node_id([a-fA-F0-9]+)/history', function(req, res) {
  const chain_id = res.locals.chain_id;
  var anchor = req.query.anchor || 0;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  node.getHistory(chain_id, req.params.node_id, anchor, from, num)
    .then((row) => {
      if (row) {
        res.status(200);
        res.send(row);
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