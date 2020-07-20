/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const node = require('../models/node');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  var range = req.query.range || 60; // seconds

  var to = new Date();
  var to_timestamp = to.getUTCFullYear() + '-' 
                   + (to.getUTCMonth()+1) + '-'
                   + to.getUTCDate() + ' '
                   + to.getUTCHours() +':'
                   + to.getUTCMinutes() + ':'
                   + to.getUTCSeconds();
  to_timestamp = req.query.upto || to_timestamp;
  var from = new Date(Date.parse(to_timestamp) - (range * 1000));
  var from_timestamp = from.getUTCFullYear() + '-' 
                     + (from.getUTCMonth()+1) + '-'
                     + from.getUTCDate() + ' '
                     + from.getUTCHours() +':'
                     + from.getUTCMinutes() + ':'
                     + from.getUTCSeconds();

  console.log(from_timestamp, "~", to_timestamp);

  node.getList(chain_id, from_timestamp, to_timestamp)
    .then((row) => {
      res.status(200);
      res.send(row);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

router.get('/:val_addr([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  const val_addr = req.params.val_addr;
  var range = req.query.range || 60; // seconds
  var to = new Date();
  var to_timestamp = to.getUTCFullYear() + '-' 
                   + (to.getUTCMonth()+1) + '-'
                   + to.getUTCDate() + ' '
                   + to.getUTCHours() +':'
                   + to.getUTCMinutes() + ':'
                   + to.getUTCSeconds();
  to_timestamp = req.query.upto || to_timestamp;
  var from = new Date(Date.parse(to_timestamp) - (range * 1000));
  var from_timestamp = from.getUTCFullYear() + '-' 
                     + (from.getUTCMonth()+1) + '-'
                     + from.getUTCDate() + ' '
                     + from.getUTCHours() +':'
                     + from.getUTCMinutes() + ':'
                     + from.getUTCSeconds();
  node.getOne(chain_id, val_addr, from_timestamp, to_timestamp)
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

router.get('/:val_addr([a-fA-F0-9]+)/history', function(req, res) {
  const chain_id = res.locals.chain_id;
  const val_addr = req.params.val_addr;
  var anchor = req.query.anchor || 0;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  node.getHistory(chain_id, val_addr, anchor, from, num)
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