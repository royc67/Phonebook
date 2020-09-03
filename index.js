const express = require('express');
const { response } = require('express');
const app = express();

app.use(express.json());

let phoneBook = [
    {name: "abc", number: "052-0000000", id: 1},
    {name: "def", number: "052-1111111", id: 2},
    {name: "ghi", number: "052-2222222", id: 3},
    {name: "jkl", number: "052-3333333", id: 4},
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
    if (!(body.number && body.name)) return response.status(400).json({error: 'name or number are missing'})
    else if (phoneBook.find(phoneRecord => phoneRecord.name === body.name)) return response.status(400).json({error: `${body.name} already exists!`})
    
    const phoneRecord = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    phoneBook = phoneBook.concat(phoneRecord);
    response.send(phoneRecord)
})


const PORT = 3001;
app.listen(PORT)
console.log(`phonebook server is listening on port ${PORT}`);