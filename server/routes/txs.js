/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const tx = require('../models/tx');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  var top = req.query.to || 0;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  tx.getList(chain_id, top, from, num)
    .then((rows) => {
      res.status(200);
      res.send(rows);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

// NOTE: this endpoint will return list.
// see note of tx.searchHash()
router.get('/:hash([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  const hash = req.params.hash;
  tx.searchHash(chain_id, hash)
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

module.exports = router;
