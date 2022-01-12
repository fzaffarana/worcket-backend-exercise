const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const CommonMiddleware = (app) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());
  app.use(morgan('tiny'));
};

const Middleware = (app) => {
  CommonMiddleware(app);
};

module.exports = Middleware;
