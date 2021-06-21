const winston = require('winston')
const winstonSequelizeTransport = require('winston-transport-sequelize')
const db = require('../models')

const options = {
  transports: [
    new winstonSequelizeTransport({
      level: 'info',
      sequelize: db.sequelizeInstance,
      tableName: 'log',
      fields: {
        log_id: {
          type: db.Sequelize.INTEGER,
          primaryKey: true.valueOf,
          autoIncrement: true
        }
      },
      modelOptions: {
        updatedAt: false
      }
    }),
    new winston.transports.Console({
      level: 'info',
      format: winston.format.simple()
    })
  ]
}

const logger = winston.createLogger(options)

module.exports = logger