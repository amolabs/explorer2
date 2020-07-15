/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const account = require('../models/account');
const tx = require('../models/tx');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  account.getList(chain_id, false, from, num)
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

router.get('/:address([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  account.getOne(chain_id, req.params.address)
    .then((rows) => {
      if (rows.length > 0) {
        res.status(200);
        res.send(rows[0]);
      } else {
        // prepare empty account
        const acc = {
          chain_id: chain_id,
          address: req.params.address,
          balance: '0',
          stake: '0',
          stake_locked: '0',
          delegate: '0',
          val_power: '0',
          eff_stake: '0',
        }
        res.status(200);
        res.send(acc);
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

router.get('/:address([a-fA-F0-9]+)/txs', function(req, res) {
  const chain_id = res.locals.chain_id;
  var top = req.query.top || 0;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  tx.getListBySender(chain_id, req.params.address, top, from, num)
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
