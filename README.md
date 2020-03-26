# AMO Blockchain Explorer v2
For AMO blockchain explorer v1, see [old repository](https://github.com/amolabs/explorer).

## Introduction
TBA

## Test run
For development testing

## Build

## Install
For production use

### Web server setup
Use static web server for client web app.

### Support service setup
* node.js server
  * server location
  * API endpoint
* mysql server
  * DB location
  * DB api endpoint

## Server API
The server API implements RESTful API with the following URIs:
### Parcels
* GET /chains/&lt;chainid&gt;/parcels/&lt;parcelid&gt;
  * get parcel &lt;parcelid&gt;
* GET /chains/&lt;chainid&gt;/parcels/&lt;parcelid&gt;/requests
  * get list of requests on the parcel &lt;parcelid&gt;
* GET /chains/&lt;chainid&gt;/parcels/&lt;parcelid&gt;/requests/&lt;address&gt;
  * get request on the parcel &lt;parcelid&gt; from buyer &lt;address&gt;
* GET /chains/&lt;chainid&gt;/requests/&lt;parcelid&gt;
  * alias of GET /chains/&lt;chainid&gt;/parcels/&lt;parcelid&gt;/requests
* GET /chains/&lt;chainid&gt;/requests/&lt;parcelid&gt;/&lt;address&gt;
  * alias of GET /chains/&lt;chainid&gt;/parcels/&lt;parcelid&gt;/requests/&lt;address&gt;
