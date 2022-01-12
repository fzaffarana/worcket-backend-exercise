const express = require('express');
const routes = require('./api/routes');
const Middleware = require('./api/middlewares');
const ErrorHandlingMiddleware = require('./api/middlewares/error');

// Express instance
const app = express();

// Mount middlewares
Middleware(app);

// Mount api routes
app.use('/', routes);

// Mount error handling middlewares
ErrorHandlingMiddleware(app);

module.exports = app;
