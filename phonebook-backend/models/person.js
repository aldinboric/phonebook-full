const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 5,
        required: [true, 'Person name is required!']
    },
    number: {
        type: String,
        validate: {
            validator: (number) => {
                return /^(\d{2})\s(\d{3})-(\d{3})-(\d{3})$/.test(number)
            },
            message: ({ number }) => `${number} is not a valid phone number!`
        },
        required: [true, 'Person phone number is required!']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

