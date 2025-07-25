const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.post('/', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'Body/Number missing!' // Odrediti koji error.
        })
    } else {
        Person.find({ name: body.name }).then(result => {
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
                }).catch(error => next(error))
            }
        })
    }
})

personsRouter.get('/', (request, response) => {
    Person.find({}).then(persons => response.json(persons))
})

personsRouter.get('/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id).then(person => {
        if (!person) {
            response.statusMessage = `Person with id ${request.params.id} does not exist in the phonebook!`

            response.status(404).end()
        } else {
            response.json(person)
        }
    }).catch(error => next(error))
})

personsRouter.put('/:id', (request, response, next) => {
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
    }).catch(error => next(error))
})

personsRouter.delete('/:id', (request, response, next) => {
    const id = request.params.id

    Person.findByIdAndDelete(id).then(person => {
        if (!person) {
            response.statusMessage = `Person with id ${request.params.id} does not exist in the phonebook!`

            response.status(404).end()
        } else {
            console.log(`Person with id ${request.params.id} has been deleted!`)

            response.json(person)
        }
    }).catch(error => next(error))
})

personsRouter.get('/info', async (request, response) => {
    const newData = (`
        <div>
            <p>Phonebook has info for ${await Person.countDocuments({})} people</p>
            <p>${(new Date()).toString()}</p>
        </div>
    `)

    response.send(newData)
})

module.exports = personsRouter