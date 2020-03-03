/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send(JSON.stringify({
    name: 'AMO blockchain explorer support server',
  }));
});

module.exports = router;
