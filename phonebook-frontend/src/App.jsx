import {useState, useEffect} from 'react'
import personsService from './services/personsService'
import createTrie from './services/personsFilterService'

const App = () => {
  const [persons, setPersons] = useState([])
  const [personsTrie, setPersonsTrie] = useState(createTrie([]))
  const [newName, setNewName] = useState('')
  const [newNumber, setnewNumber] = useState('')
  const [nameFilter, setNewNameFilter] = useState('')
  const [notificationData, setWarning] = useState()

  useEffect(() => {
    personsService.read().then(data => {
      setPersons(data)
      setPersonsTrie(createTrie(data))
    })
  }, [])

  const addNewPerson = (event) => {
    event.preventDefault()

    if (newName === '' && newNumber === '') {
      alert('Missing full name and phone number!')
    } else if (newName === '') {
      alert('Missing full name!')
    } else if (newNumber === '') {
      alert('Missing phone number!')
    } else if (persons.some(person => person.name === newName)) {
        const personTmp = persons.filter(person => person.name === newName)[0]
        personsService.update(personTmp.id, {...personTmp, number: newNumber}).then(data => {
          setPersons(persons.map(person => person.id !== personTmp.id ? person : data))
          setWarning({
            message: `Number updated for person "${personTmp.name}"!`,
            type: 'notification'
          })
          setTimeout(() => setWarning(), 5000)
        }).catch(error => {
          setWarning({
            message: `Information of ${personTmp.name} has already been removed from the server!`,
            type: 'warning'
          })
          setPersons(persons.filter(person => person.name != personTmp.name))
          setTimeout(() => setWarning(), 5000)
        })
    } else {
        personsService.create({name: newName, number: newNumber}).then(data => {
          setPersons([...persons, data])
          personsTrie.addPerson(data.name)
          setWarning({
            message: `Added new person "${data.name}"!`,
            type: 'notification'
          })
          setTimeout(() => setWarning(), 5000)
          setNewName('')
          setnewNumber('')
      })
    }
  }

  const deletePerson = (id) => {
    personsService.remove(id).then(person => {
      setPersons(persons.filter(person => person.id !== id))
      setWarning({
        message: `Removed ${person.name}!`,
        type: 'notification'
      })
      setTimeout(() => setWarning(), 5000)
    })
  }

  const handleNameInputChange = (event) => setNewName(event.target.value)
  const handleNumberInputChange = (event) => setnewNumber(event.target.value)
  const handleNameFilterInputChange = (event) => setNewNameFilter(event.target.value)
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notificationData={notificationData}/>
      <div>
        Filter persons by full name: <input value={nameFilter} onChange={handleNameFilterInputChange}/>
      </div>
      <h4>Add new number</h4>
      <form onSubmit={addNewPerson}>
        <div>
          Full name: <input value={newName} onChange={handleNameInputChange}/>
          Phone number: <input value={newNumber} onChange={handleNumberInputChange}/>
          <button type="submit">Add</button>
        </div>
      </form>
      <h4>Numbers</h4>
      <Persons persons={persons} filter={{nameFilter: nameFilter, personsTrie: personsTrie}} operations={{deletePerson}}/>
    </div>
  )
}

const Persons = ({persons, filter=undefined, operations={}}) => {
  if (filter !== undefined) {
    if (filter.nameFilter !== '') {
      const filteredPersons = filter.personsTrie.getWordsWithPrefix(filter.nameFilter)
      persons = persons.filter(person => filteredPersons.includes(person.name))
    }
  } 
  
  const personLiList = persons.map(person => <PersonLi key={person.id} person={person} operations={operations}/>)
  
  return (
    <ul>
      {personLiList}
    </ul>
  )
}

const Person = ({person, operations}) => {
  return (
    <>
      Full name: {person.name} | Phone number: {person.number}
      <button onClick={() => operations.deletePerson(person.id)}>Remove</button>
    </>
  )
}

const PersonLi = ({person, operations}) => {
  return (
    <li>
      {<Person person={person} operations={operations}/>}
    </li>
  )
}

const Notification = ({notificationData}) => {
  const style = {
    color: undefined,
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  if (notificationData === undefined) {
    return undefined
  } else {
    style.color = notificationData.type === 'warning' ? 'red' : '#008000'

    return (
      <div style={style}>
        {notificationData.message}
      </div>
    )
  }
}

export default App