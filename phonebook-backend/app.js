const express = require('express')
const config = require('./utils/config')
const mongoose = require('mongoose')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const app = express()

logger.info('Connecting to: ', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI).then(() => {
    logger.info('Connected to MongoDB!')
}).catch(error => logger.error('MongoDB connection error:', error.message))

app.use(express.json())
app.use(express.static('dist'))
app.use(middleware.createMorganMiddelwareFunction())
app.use('/api/persons', personsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app




