/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const node = require('../models/node');

function dateToStr(target) {
  return target.getUTCFullYear() + '-' 
        + (target.getUTCMonth()+1) + '-'
        + target.getUTCDate() + ' '
        + target.getUTCHours() +':'
        + target.getUTCMinutes() + ':'
        + target.getUTCSeconds() + 'Z';
}

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  const range = req.query.range || 60; // seconds

  const to = dateToStr(new Date());
  const from = dateToStr(new Date(Date.parse(to) - range * 1000));

  node.getList(chain_id, from, to)
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
  const node_id = req.params.node_id;
  const range = req.query.range || 60; // seconds

  const to = dateToStr(new Date());
  const from = dateToStr(new Date(Date.parse(to) - range * 1000));

  node.getOne(chain_id, node_id, from, to)
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
  const node_id = req.params.node_id;
  const now = dateToStr(new Date());

  const anchor = req.query.anchor || now;
  const from = req.query.from || 0;
  const num = req.query.num || 20;
  node.getHistory(chain_id, node_id, anchor, from, num)
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