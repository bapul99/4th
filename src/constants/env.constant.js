// env.constant.js

const ENVIRONMENT = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3306;
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost:3306/express-database';

module.exports = {
  ENVIRONMENT,
  PORT,
  DATABASE_URL,
};