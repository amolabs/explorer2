/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const account = require('../models/account');

router.get('/', function(req, res) {
  //const chain_id = res.locals.chain_id;
  res.status(200);
  res.send([]);
});

router.get('/:address([a-fA-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  account.getOne(chain_id, req.params.address)
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
