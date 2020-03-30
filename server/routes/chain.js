/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();

const chain = require('../models/chain');
var blocks = require('./blocks');
var txs = require('./txs');
var accounts = require('./accounts');
var parcels = require('./parcels');

router.use('/blocks', blocks);
router.use('/txs', txs);
router.use('/accounts', accounts);
router.use('/parcels', parcels);

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  chain.getSummary(chain_id)
    .then((val) => {
      //console.log('then', val);
      res.send(val);
    })
    .catch((err) => {
      if (err == 'not found') {
        res.status(404).send('not found');
      } else {
        console.log(err);
        res.status(500).send(err);
      }
    });
});

module.exports = router;
