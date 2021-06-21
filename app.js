require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const config = require('./config')
const routes = require('./routes')
const logger = require('./utils/logger')

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json({limit: '50mb', parameterLimit: 100000, extended: true}))

app.use('/images', express.static(__dirname+'/images'))
app.use('/api/v2', routes)

app.listen(config.server.port, () => {
  logger.info('server started')
})