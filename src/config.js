module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL || 'postgresql://thingful@localhost/thingful',
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || 'postgresql://thingful@localhost/thingful',
  JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
};
