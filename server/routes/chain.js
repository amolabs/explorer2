/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const chain = require('../models/chain');
const block = require('../models/block');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  chain.getSummary(chain_id)
    .then((rows) => {
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.status(404);
        res.send('not found');
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get('/blocks', function(req, res) {
  const chain_id = res.locals.chain_id;
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
});

router.get('/blocks/:height([0-9]+)', function(req, res) {
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

module.exports = router;
