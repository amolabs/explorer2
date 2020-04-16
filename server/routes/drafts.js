/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const draft = require('../models/draft');
const stat = require('../models/stat');

router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  if ('stat' in req.query) {
    var num_blks = req.query.num_blks || 0;
    stat.getDraftStat(chain_id, num_blks)
      .then((row) => {
        res.status(200);
        res.send(row);
      })
      .catch((err) => {
        res.status(500);
        res.send(err);
      });
  } else {
    var anchor = req.query.anchor || 0;
    var from = req.query.from || 0;
    var num = req.query.num || 20;
    draft.getList(chain_id, anchor, from, num)
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

router.get('/:draft_id([0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  const draft_id = req.params.draft_id;
  draft.getOne(chain_id, draft_id)
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

module.exports = router;
