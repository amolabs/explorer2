/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const udc = require('../models/udc');
const relation = require('../models/relation');

/**
 * @swagger
 * definitions:
 *   UDCBalance:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       address:
 *         type: string
 *       udc_id:
 *         type: integer
 *         description: UDC id
 *       desc:
 *         type: string
 *         description: description of the UDC
 *       balance:
 *         type: string
 *         description: quoted decimal number
 *   UDCBalanceChange:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       address:
 *         type: string
 *       udc_id:
 *         type: integer
 *         description: UDC id
 *       height:
 *         type: integer
 *       index:
 *         type: integer
 *         nullabe: true
 *         description: when `type` is 'block', `index` is `null`
 *       amount:
 *         type: string
 *         description: quoted decimal number
 *       tx_type:
 *         type: string
 *         description: either 'block' or `type` of tx. `type` is 'block' when
 *           this balance change is due to validator incentive or penalty.
 *       tx_hash:
 *         type: string
 *         description: hash of tx
 *       tx_sender:
 *         type: string
 *         description: sender address of tx
 *       tx_fee:
 *         type: string
 *         description: quoted decimal number, fee of tx, always represented as
 *           positive number
 *       tx_payload:
 *         type: string
 *         description: JSON representation of tx's payload
 */

/**
 * @swagger
 * /chain/{chain_id}/accounts/{address}/udcs:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Address'
 *     - name: from
 *       in: query
 *       description: offset from the result
 *       schema:
 *         type: integer
 *         default: 0
 *     - name: num
 *       in: query
 *       description: number of items to retrieve
 *       schema:
 *         type: integer
 *         default: 20
 *   get:
 *     tags:
 *       - accounts
 *     description: Get UDC list owned by address
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: UDC list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/UDCBalance'
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  const address = res.locals.address;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  udc.getBalancesByAccount(chain_id, address, from, num)
    .then((rows) => {
      res.status(200);
      res.send(rows);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

/**
 * @swagger
 * /chain/{chain_id}/accounts/{address}/udcs/{udc_id}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Address'
 *     - name: udc_id
 *       in: path
 *       schema:
 *         type: integer
 *   get:
 *     tags:
 *       - accounts
 *     description: Get UDC balance
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: UDC balance
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/UDCBalance'
 */
router.get('/:udc_id([0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  const address = res.locals.address;
  udc.getBalance(chain_id, address, req.params.udc_id)
    .then((rows) => {
      res.status(200);
      res.send(rows);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

/**
 * @swagger
 * /chain/{chain_id}/accounts/{address}/udcs/{udc_id}/history:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/Address'
 *     - name: udc_id
 *       in: path
 *       schema:
 *         type: integer
 *     - name: anchor
 *       in: query
 *       description: anchor height to query (0 value means last block)
 *       schema:
 *         type: integer
 *         default: 0
 *     - name: from
 *       in: query
 *       description: offset from the result
 *       schema:
 *         type: integer
 *         default: 0
 *     - name: num
 *       in: query
 *       description: number of items to retrieve
 *       schema:
 *         type: integer
 *         default: 20
 *   get:
 *     tags:
 *       - accounts
 *     description: Get UDC balance history
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: UDC balance history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/UDCBalanceChange'
 */
router.get('/:udc_id([0-9]+)/history', function(req, res) {
  const chain_id = res.locals.chain_id;
  const address = res.locals.address;
  const udc_id = req.params.udc_id;
  var anchor = req.query.anchor || 0;
  var from = req.query.from || 0;
  var num = req.query.num || 20;
  relation.getUDCBalanceHistory(chain_id, address, udc_id, anchor, from, num)
    .then((rows) => {
      res.status(200);
      res.send(rows);
    })
    .catch((err) => {
      res.status(500);
      res.send(err);
    });
});

module.exports = router;
