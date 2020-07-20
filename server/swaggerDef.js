module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'AMO blockchain explorer API',
    contact: {
      name: 'AMO Labs dev team',
      url: 'https://github.com/amolabs',
      email: 'dev@amolabs.io',
    },
    license: {
      name: 'Apache 2.0',
    },
    version: '2.0',
  },
  tags: [
    {
      name: 'default',
      description: 'default'
    },
    {
      name: 'chain',
      description: 'chain'
    },
    {
      name: 'blocks',
      description: 'blocks'
    },
    {
      name: 'txs',
      description: 'transactions'
    },
  ],
  basePath: '/',
}
