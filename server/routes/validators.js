/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const account = require('../models/account');
const validator = require('../models/validator');
const stat = require('../models/stat');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  if ('stat' in req.query) {
    var num_blks = req.query.num_blks || 0;
    stat.getValidatorStat(chain_id, num_blks)
      .then((row) => {
        res.status(200);
        res.send(row);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });
  } else {
    var from = req.query.from || 0;
    var num = req.query.num || 20;
    account.getList(chain_id, true, from, num)
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
  }
});

router.get('/:address([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  validator.getOne(chain_id, req.params.address)
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

router.get('/:address([a-fA-F0-9]+)/delegators', function(req, res) {
  const chain_id = res.locals.chain_id;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  validator.getDelegators(chain_id, req.params.address, from, num)
    .then((rows) => {
      if (rows) {
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
