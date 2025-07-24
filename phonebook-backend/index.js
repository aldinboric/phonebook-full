require('dotenv').config()

const morgan = require('morgan')
const express = require('express')
const Person = require('./models/person')

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

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :path :status :content-length - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => response.json(persons))
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id 

    Person.findById(id).then(person => {
        if (!person) {
            response.statusMessage = `Person with id ${request.params.id} does not exist in the phonebook!`
            response.status(404).end()
        } else {
            response.json(person)
        }
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    console.log('ID:', id)

    Person.findByIdAndDelete(id).then(person => {
        if (!person) {
            response.statusMessage = `Person with id ${request.params.id} does not exist in the phonebook!`
            response.status(404).end()
        } else {
            console.log(`Person with id ${request.params.id} has been deleted!`)
            response.json(person)
        }
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Body/Number missing!'
        })
    } else {
        Person.find({name: body.name}).then(result => {
            if (result.length > 0) {
                return response.status(400).json({
                    error: 'Name already exists!'
                })
            } else {
                const person = new Person({
                    name: body.name,
                    number: body.number
                })

                person.save().then(savedPerson => {
                    response.json(savedPerson)
                })
            }
        })
    }
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body

    Person.findById(id).then(foundPerson => {
        if (!foundPerson) {
            response.statusMessage = `Person with id ${request.params.id} was already deleted or does not exist in the phonebook!`

            return response.status(404).end()
        } else {
            foundPerson.number = body.number

            return foundPerson.save().then(savedPerson => {
                response.json(savedPerson)
            })
        }
    })

    return
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(console.log(`Server running on port ${PORT}`))
})

