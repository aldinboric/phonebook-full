import axios from 'axios'

const baseUrl = '/api/persons'

const create = async (newPerson) => {
    return axios.post(baseUrl, newPerson).then(response => response.data)
}

const read = async () => {
    return axios.get(`${baseUrl}`).then(response => response.data)
}

const update = async (id, updatedPerson) => {
    return axios.put(`${baseUrl}/${id}`, updatedPerson).then(response => response.data)
}

const remove = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

export default {
    create, 
    read, 
    update, 
    remove
}

