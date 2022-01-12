const app = require('./app');

const {
  api: { port }
} = require('./config');

(async () => {
  // Listen to requests
  app.listen(port, () => console.log(`Running on port ${port} (${process.env.NODE_ENV})`));
})();
