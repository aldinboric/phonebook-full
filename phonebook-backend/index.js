const express = require('express')
const morgan = require('morgan')

morgan.token('body', (request) => {
    return JSON.stringify(request.body)
})

morgan.token('path', (request) => {
    return request.path
})

morgan.token('content-length', (request, response) => {
    return response.getHeader('content-length')
})

const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.json())
app.use(morgan(':method :path :status :content-length - :response-time ms :body'))
// app.use(requestLogger)
app.use(express.static('dist'))


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id 
    const person = persons.find(person => person.id === id)

    if (!person) {
        response.statusMessage = `Person with id ${request.params.id} does not exist in the phonebook!`
        response.status(404).end()
    }

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const newId = (Math.floor(Math.random() * 1000) + 1).toString()

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Body/Number missing!'
        })
    } else if (persons.filter(person => person.name === body.name).length === 1) {
        return response.status(400).json({
            error: 'Name already exists!'
        })
    }
    
    const person = {
        id: newId,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

app.get('/info', (request, response) => {
    const newData = (`
        <div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${(new Date()).toString()}</p>
        </div>
    `)

    response.send(newData)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'Unknown endpoint!'
    })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(console.log(`Server running on port ${PORT}`))
})

