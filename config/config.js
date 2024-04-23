const dotenv = require('dotenv');
const path = require('path');
const logger = require('../config/logger'); // Assuming you have a logger utility

// Load environment variables from .env file
const envFilePath = path.join(__dirname, '../.env');
logger.info(`Loading environment variables from ${envFilePath}`);
dotenv.config({ path: envFilePath });

// Export environment variables
module.exports = {
  accessKey: process.env.S3_ACCESS_KEY,
  bucket: process.env.Bucket,
  mongoUri: process.env.mongo_uri,
  accessSecret: process.env.S3_ACCESS_SECRET,
  region: process.env.REGION,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
};

logger.info('Environment variables loaded successfully');
