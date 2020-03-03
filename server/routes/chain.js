/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  chainid = res.locals.chainid;
  chain_summary = {
    desc: 'chain summary',
    chainid: chainid,
  };
  res.send(JSON.stringify(chain_summary));
});

router.get('/blocks', function(req, res) {
  chainid = res.locals.chainid;
  if (req.query.stat) {
    blocks_stat = {
      desc: 'blocks stat',
      chainid: chainid,
      num_blocks: req.query.num_blocks,
    };
    res.send(JSON.stringify(blocks_stat));
  } else {
    // todo
  }
});

router.get('/blocks/:height(\d+)', function(req, res) {
  chainid = res.locals.chainid;
  block = {
    desc: 'blocks detail'
    chainid: chainid,
    height: req.params.height,
  };
  res.send(JSON.stringify(block));
});

module.exports = router;
