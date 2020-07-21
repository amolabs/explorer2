const path = require('path');
const SwaggerPlugin = require('swagger-jsdoc-sync-webpack-plugin');
const swaggerDefinition = require('./swaggerDef.js');
const swaggerOptions = {
  swagger: swaggerDefinition,
  apis: [
    'routes/index.js',
    'routes/networks.js',
    'routes/chain.js',
    'routes/genesis.js',
    'routes/app_config.js',
    'routes/blocks.js',
    'routes/txs.js',
    'routes/accounts.js',
    'routes/validators.js',
    'routes/drafts.js',
    'routes/parcels.js',
    'routes/storages.js',
    'routes/nodes.js',
  ]
}

module.exports = {
  plugins: [
    new SwaggerPlugin(swaggerOptions),
  ],
  mode: 'production',
  entry: './main.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'amo-explorer-api.js',
  },
}
