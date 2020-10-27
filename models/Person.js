require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');




  
  const url = process.env.MONGODB_URI;

  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
      name: { type: String, unique: true,  minlength: 3},
      number: { type: String,  minlength: 8},
  })

  personSchema.plugin(uniqueValidator)

  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

  

  if (process.argv.length > 3){
    person.save().then(result => {
        console.log(`added ${personName} number ${personNumber} to phonebook`)
        mongoose.connection.close()
    })
  } else if(process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(man => {
            console.log(`${man.name} ${man.number}`)
        })
        mongoose.connection.close()
    })
} 

module.exports = mongoose.model('Person', personSchema);