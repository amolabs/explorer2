/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const block = require('../models/block');
const tx = require('../models/tx');
const stat = require('../models/stat');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  if ('stat' in req.query) {
    var non_empty = 'non_empty' in req.query;
    var num_blks = req.query.num_blks || 0;
    stat.getBlockStat(chain_id, non_empty, num_blks)
      .then((rows) => {
        res.status(200);
        res.send(rows);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });
  } else {
    var from = req.query.from || 0;
    var num = req.query.num || 20;
    var order = req.query.order || 'desc';
    block.getList(chain_id, from, num, order)
      .then((rows) => {
        res.status(200);
        res.send(rows);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });
  }
});

router.get('/:height([0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  const height = req.params.height;
  block.getOne(chain_id, height)
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

router.get('/:height([0-9]+)/txs', function(req, res) {
  const chain_id = res.locals.chain_id;
  const height = req.params.height;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  tx.getListByBlock(chain_id, height, from, num)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200);
        res.send(rows);
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

// CAUTION: uses tx model
router.get('/:height([0-9]+)/txs/:index([0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  const height = req.params.height;
  const index = req.params.index;
  tx.getOne(chain_id, height, index)
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
