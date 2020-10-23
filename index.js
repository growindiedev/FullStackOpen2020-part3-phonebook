//const http =require('http')
const { response, request } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(":method :url :status :response-time ms :body"))

let persons = [
    {
      name: "Arto Hellas",
      number: "040-123456",
      id: 1
    },
    {
      name: "Ada Lovelace",
      number: "39-44-5323523",
      id: 2
    },
    {
      name: "Dan Abramov",
      number: "12-43-234345",
      id: 3
    },
    {
      name: "Mary Poppendieck",
      number: "39-23-6423122",
      id: 4
    }
  ]

// const app = http.createServer((request, response) => {
//     response.writeHead(200, {'Content-Type': 'application/json'})
//     response.end(JSON.stringify(persons))
// })

morgan.token("body", function getBody(req) {
  return JSON.stringify(req.body)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})



app.get('/info', (request, response) => {
    let date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${date}</p>`)
    
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(man => man.id == id)
  

  person ? response.json(person) : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(man => man.id != id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  //const maxId = persons.length > 0 ? Math.max(...persons.map(per =>per.id)) : 0
  const person = request.body;
  if (!person.name || !person.number ){
    return response.status(400).json({
      error: 'content missing'
    })
  } else if (persons.find(man => man.name === person.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  person.id =  Math.floor(Math.random() * 10000) + persons.length 
  persons = persons.concat(person)
  response.json(person)
})

morgan.token('body', (req, res) => console.log(JSON.stringify(req.body)));



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})