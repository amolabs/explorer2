/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const chain = require('../models/chain');
const block = require('../models/block');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  chain(chain_id)
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
  if (req.query.stat) {
    var blocks_stat = {
      desc: 'blocks stat',
      chain_id: chain_id,
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
  const chain_id = res.locals.chain_id;
  const height = req.params.height;
  block(chain_id, height)
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

module.exports = router;
