/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const block = require('../models/block');

router.get('/', function(req, res) {
  const chainid = res.locals.chainid;
  var chain_summary = {
    desc: 'chain summary',
    chainid: chainid,
  };
  res.send(JSON.stringify(chain_summary));
});

router.get('/blocks', function(req, res) {
  const chainid = res.locals.chainid;
  if (req.query.stat) {
    var blocks_stat = {
      desc: 'blocks stat',
      chainid: chainid,
      num_blocks: req.query.num_blocks,
    };
    res.send(JSON.stringify(blocks_stat));
  } else {
    // todo
    var limit = req.query.limit || 10;
    var blocks = {
      desc: 'list of blocks',
    }
    res.send(JSON.stringify(blocks));
  }
});

router.get('/blocks/:height([0-9]+)', function(req, res) {
  const chainid = res.locals.chainid;
  const height = req.params.height;
  block(chainid, height)
    .then((rows) => {
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        // TODO: 404
        res.send('not found');
      }
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
