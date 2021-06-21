const env = process.env.NODE_ENV || 'development'
const dbConfig = require('./database')

module.exports = {
  server: {
    env,
    port: process.env.SERVER_PORT || 3000
  },
  database: dbConfig[env],
  jwt: {
    secret: process.env.ACCESS_TOKEN_SECRET || 'secret'
  },
  user: {
    maxPasswordLength: 16
  }
}