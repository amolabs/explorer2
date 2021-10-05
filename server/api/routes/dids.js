/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const did = require('../models/did');

/**
 * @swagger
 * definitions:
 *   DID:
 *     name: did
 *     in: path
 *     description: "DID to inspect."
 *     required: true
 *     schema:
 *       type: string
 *     style: simple
 *   DIDInfo:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       id:
 *         type: string
 *       owner:
 *         type: string
 *         description: hexadecimal string
 *       document:
 *         type: object
 *         description: DID Document associated with the DID
 *       active:
 *         type: boolean
 */

/**
 * @swagger
 * /chain/{chain_id}/dids:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
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
 *       - dids
 *     description: Get DID list (not sorted)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: DID list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/DIDInfo'
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  did.getList(chain_id)
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
 * /chain/{chain_id}/dids/{did}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/DID'
 *   get:
 *     tags:
 *       - dids
 *     description: Get DID document info by DID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: DID document info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/DIDInfo'
 *       404:
 *         description: DID not found
 */
router.get('/:did([a-z]+:[A-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  did.getOne(chain_id, req.params.did)
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
