const mongoose = require('mongoose')


const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.set('strictQuery', false)

// 2. Connect to the cloud
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// 3. Define the Schema (The Blueprint)
const personSchema = new mongoose.Schema({
  name:{
    type: String,
    minLength: 3,
    required: true,
  },
  number:{
    type: String,
    minLength: 8,
    required: true,
  }

})

// 4. Clean up the output (Remove the weird _id and __v before sending to frontend)
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// 5. Export the model so index.js can use it
module.exports = mongoose.model('Person', personSchema)