const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const multer = require('multer');
const route = require('./routes/route.js');
const config = require('./config/config');
const mongoose = require('mongoose');
const logger = require('./config/logger');
const cors = require('cors');

require('dotenv').config({ path: '.env' });

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any());

mongoose.connect(process.env.mongo_uri)
  .then(() => logger.info('MongoDB is connected'))
  .catch(err => logger.error(`MongoDB connection error: ${err}`));

app.use('/', route); 

const port = process.env.PORT || 9000;
app.listen(port, () => {
  logger.info(`Ecommerce Server running on port ${port}`);
});
