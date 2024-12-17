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

// Updated CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from localhost or other trusted origins
    const allowedOrigins = ['http://localhost:5173', 'https://your-deployed-frontend.com'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials like cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'], // Explicitly allow x-api-key
};

app.use(cors(corsOptions)); // Enable CORS middleware

// Security middleware
app.use(helmet());
app.use(compression());
app.use(mongoSanitize());

// Body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer for handling multipart/form-data
app.use(multer().any());

// JSON middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.mongo_uri)
  .then(() => logger.info('MongoDB is connected'))
  .catch((err) => logger.error(`MongoDB connection error: ${err}`));

// Routes
app.use('/', route);

// Start the server
const port = process.env.PORT || 9000;
app.listen(port, () => {
  logger.info(`Ecommerce Server running on port ${port}`);
});
