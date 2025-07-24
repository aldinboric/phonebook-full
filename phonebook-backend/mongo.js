const mongoose = require('mongoose')

const main = async () => {
    if (process.argv.length < 3 || process.argv.length > 5) {
        console.log('Usage: node mongo.js <password> <name>')
        
        process.exit(1)
    } else {
        const password = process.argv[2]
        const url = `mongodb+srv://aldinboric:${password}@cluster0.1tbut0m.mongodb.net/phonebookFullData?retryWrites=true&w=majority&appName=Cluster0`
        
        mongoose.set('strictQuery', false)
        mongoose.connect(url)

        console.log('Connection opened.')
        
        const personSchema = new mongoose.Schema({
            name: String,
            number: String
        })

        const Person = mongoose.model('Person', personSchema)

        if (process.argv.length === 5) {
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            })

            await addNewContact(person)
        } else {
            await getAllEntries(Person)
        }

        console.log('Connection closed.')
        mongoose.connection.close()
    }
}

const addNewContact = async (person) => {
    const result = await person.save()
    console.log(`Added ${person.name} number ${person.number} to the phonebook!`)
}

const getAllEntries = async (Person) => {
    const result = await Person.find({})
    console.log('Phonebook:')
    result.forEach(person => {
        console.log(person.name, person.number)
    })
}

main()

