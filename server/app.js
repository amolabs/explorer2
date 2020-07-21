/* vim: set sw=2 ts=2 expandtab : */
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./dist/swagger.json');
//const swaggerJSDoc = require('swagger-jsdoc');
//const swaggerSpec = swaggerJSDoc(swaggerOptions);

const indexRouter = require('./routes/index');

var app = express();

app.use(logger('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin: '*', optionsSuccessStatus: 200}));

app.use('/', indexRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
