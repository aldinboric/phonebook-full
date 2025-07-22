const trie = () => {
    const node = (isKey) => {
        return {
            key: isKey,
            links: {}
        }
    }

    const getFirstChar = (word) => {
        return word[0]
    }

    const rootNode = node(false)

    const addPerson = (personName) => {
        if (contains(personName)) { return }

        const addPersonHelper = (personName, currentNode) => {
            if (personName.length === 0) { return } 
            else {
                if (!(getFirstChar(personName) in currentNode.links)) {
                    currentNode.links[getFirstChar(personName)] = node(personName.length === 1 ? true : false)
                }   

                addPersonHelper(personName.slice(1, personName.length), currentNode.links[getFirstChar(personName)])
            }
        }
    
        addPersonHelper(personName, rootNode)
    }

    const contains = (personName) => {
        const containsHelper = (personName, currentNode) => {
            if (personName.length === 0) {
                if (currentNode.key === true) {
                    return true
                } else {
                    return false
                }
            } else if (getFirstChar(personName) in currentNode.links) {
                return containsHelper(personName.slice(1, personName.length), currentNode.links[getFirstChar(personName)])
            } else {
                return false
            }
        }

        return containsHelper(personName, rootNode)
    }

    const getWordsWithPrefix = (prefix) => {
        const personNames = [prefix]

        const findStartingNode = (personName, currentNode) => {
            if (personName.length === 0) {
                return currentNode
            } else if (getFirstChar(personName) in currentNode.links) {
                return findStartingNode(personName.slice(1, personName.length), currentNode.links[getFirstChar(personName)])
            } else {
                return undefined
            }
        }
        
        const getWordsWithPrefixHelper = (personName, currentNode) => {
            if (Object.keys(currentNode.links).length === 0) { return } 

            for(let nodeKey in currentNode.links) {
                if (currentNode.links[nodeKey].key === true) {
                    personNames.push(prefix.concat(personName).concat(nodeKey))
                }

                getWordsWithPrefixHelper(personName.concat(nodeKey), currentNode.links[nodeKey])
            }
        }

        const startingNode = findStartingNode(prefix, rootNode)

        if (startingNode !== undefined && prefix !== '') {
            getWordsWithPrefixHelper('', startingNode)
        } 

        return personNames
    }

    return {addPerson, contains, getWordsWithPrefix}
}

const createTrie = (personNames) => {
    const newTrie = trie()
    personNames.forEach(personName => newTrie.addPerson(personName.name)) 

    return newTrie
}

export default createTrie
