const express = require('express');
const app = express();
const morgan = require('morgan')

app.use(express.json());
app.use(morgan('dev'))

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const validateInput = (body) => {
    if (!(body.number && body.name)) return {error: true, message: 'name or number are missing'}
    else if (phoneBook.find(phoneRecord => phoneRecord.name === body.name)) return {error: true, message: `${body.name} already exists!`}
    else if (typeof(body.number) !== "string" && typeof(body.name) !== "string") return {error: true, message: 'invalid inputs. name/number must conatain string'}
    else return {error: false, message: 'OK'}
}

app.use(requestLogger);

let phoneBook = [
    {name: "abc", number: "052-0000000", id: 1},
    {name: "def", number: "052-1111111", id: 2},
    {name: "ghi", number: "052-2222222", id: 3},
    {name: "jkl", number: "052-3333333", id: 4},
]
const options = [
  {message: 'Get info.' ,method: 'get', path: '/info'},
  {message: 'Request phonebook.' ,method: 'get', path: '/api/persons'},
  {message: 'Request person by ID.' ,method: 'get', path: '/api/persons/:id'},
  {message: 'Delete person by ID.' ,method: 'delete', path: '/api/persons/:id'}, 
  {message: 'Add person to phonebook. must add name+number in the request\'s body.' ,method: 'post', path: '/api/persons'},
  {message: 'get options' ,method: 'options', path: '/'}  
]

app.get('/info', (request, response) =>{
    const currentDate = new Date();
    response.send(
        `PhoneBook has info for ${phoneBook.length} people. <br><br>
        ${currentDate}`
    )
})

app.get('/api/persons', (request, response)=>{
    response.send(phoneBook);
})

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    const phoneRecord = phoneBook.find(phoneRecord => phoneRecord.id === id)
    if (phoneRecord) response.json(phoneRecord)
    else response.status(400).json({error: `ID: ${id} was not found!`}).end()
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    phoneBook = phoneBook.filter(phoneRecord => phoneRecord.id !== id)
    response.status(204).end()
})

const generateId = () => {
    return Math.floor((Math.random() * 10000) + 1)
}

app.post('/api/persons', (request, response) =>{
    const body = request.body;
    const valInput = validateInput(body)
    if (valInput.error) return response.status(400).json({error: valInput.message})
    // else if (phoneBook.find(phoneRecord => phoneRecord.name === body.name)) return response.status(400).json({error: `${body.name} already exists!`})
    
    const phoneRecord = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    phoneBook = phoneBook.concat(phoneRecord);
    response.send(phoneRecord)
})

app.options('/', (request, response) => {
    response.send(
        options.map((option, i) => `${i+1}. ${option.message}: method: ${option.method} path: ${option.path}`)
    )
})

const unknownEndpoint = (request, response) => {
    return response.status('400').json({error: 'Unknown endpoint'})
}

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT)
console.log(`phonebook server is listening on port ${PORT}`);