const morgan = require('morgan')

const createMorganMiddelwareFunction = () => {
    morgan.token('body', (request) => {
        return JSON.stringify(request.body)
    })

    morgan.token('path', (request) => {
        return request.path
    })

    morgan.token('content-length', (request, response) => {
        return response.getHeader('content-length')
    })

    return morgan(':method :path :status :content-length - :response-time ms :body')
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'Unknown endpoint!'
    })
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'Malformatted ID!' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

module.exports = {
    createMorganMiddelwareFunction,
    unknownEndpoint,
    errorHandler
}