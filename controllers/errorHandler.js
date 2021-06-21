const logger = require('../utils/logger')
const response = require('../utils/response')

module.exports = (message, path) => {
  logger.error(message, {meta: {path}})
  return response.internalServerError()
}