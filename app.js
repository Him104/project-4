const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const multer = require('multer');
const route = require('./routes/route.js');
const config = require('./config/config');
const mongoose = require('mongoose');
const logger = require('./config/logger');
const cors = require('cors');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');


require('dotenv').config({ path: '.env' });

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || config.frontendUrls.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));


app.use(helmet());
app.use(compression());
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any());
app.use(express.json());



mongoose.connect(process.env.mongo_uri)
  .then(() => logger.info('MongoDB is connected'))
  .catch(err => logger.error(`MongoDB connection error: ${err}`));

app.use('/', route); 

const port = process.env.PORT || 9000;
app.listen(config.port, () => {
  logger.info(`Ecommerce Server running on port ${port}`);
});
