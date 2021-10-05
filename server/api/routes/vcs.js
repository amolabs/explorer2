/* vim: set sw=2 ts=2 expandtab : */
var express = require('express');
var router = express.Router();
const vc = require('../models/vc');

/**
 * @swagger
 * definitions:
 *   VCID:
 *     name: vcid
 *     in: path
 *     description: "Verifiable Credential ID to inspect."
 *     required: true
 *     schema:
 *       type: string
 *     style: simple
 *   VCInfo:
 *     type: object
 *     properties:
 *       chain_id:
 *         type: string
 *       id:
 *         type: string
 *       issuer:
 *         type: string
 *         description: hexadecimal string
 *       credential:
 *         type: object
 *         description: Verifiable Credential associated with the DID
 *       active:
 *         type: boolean
 */

/**
 * @swagger
 * /chain/{chain_id}/vcs:
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
 *     description: Get VC list (not sorted)
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: VC list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/VCInfo'
 */
router.get('/', function(req, res) {
  const chain_id = res.locals.chain_id;
  vc.getList(chain_id)
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
 * /chain/{chain_id}/vcs/{vcid}:
 *   parameters:
 *     - $ref: '#/definitions/ChainId'
 *     - $ref: '#/definitions/VCID'
 *   get:
 *     tags:
 *       - dids
 *     description: Get verifiable credential info by VCID
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Verifiable credential info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/VCInfo'
 *       404:
 *         description: DID not found
 */
router.get('/:vcid([a-z]+:[a-z]+:[A-F0-9]+)', function(req, res) {
  const chain_id = res.locals.chain_id;
  vc.getOne(chain_id, req.params.vcid)
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
