require('dotenv').config()
const { response, request } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/Person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(":method :url :status :response-time ms :body"))




morgan.token("body", function getBody(req) {
  return JSON.stringify(req.body)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => response.json(persons))
})



app.get('/info', (request, response) => {
    let date = new Date()
    Person.count({}).then( result => response.send(`<p>Phonebook has info for ${result} people</p> <p>${date}</p>`));
    
})


app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if(person) {
      response.json(person) 
    } else {
      response.status(404).end()
    }
    })
    .catch(error => {
      next(error)
    })
  
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndRemove(id).then(person => response.status(204).end())
  .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number ){
    return response.status(400).json({
      error: 'content missing'
    })
  }  

   const person = new Person ({
    name: body.name,
    number: body.number
    })

    person.save().then(savedPerson => response.json(savedPerson)).catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
      name: body.name,
      number: body.number
      }

    Person.findByIdAndUpdate(request.params.id, person, {new : true})
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))

  })
  
    
  
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if(error.name === 'CastError' && error.kind == 'ObjectId'){
      return response.status(400).send({ error: 'malformatted id' })
    }  else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }

  app.use(errorHandler)

morgan.token('body', (req, res) => console.log(JSON.stringify(req.body)));



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)})