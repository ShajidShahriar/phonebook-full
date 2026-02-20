const mongoose = require('mongoose')

// 1. Check if you passed the password
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}


// 2. The Connection String (Use your real one here if you want, or better, use the logic below)
// Since this is a test script, we often hardcode the URI part but inject the password.
// REPLACE 'phonebookApp' with your actual database name if different.
const url =
  'mongodb+srv://shajidsr12_db_user:2zxxfNcZsQPZWvcZ@cluster0.mmmjji3.mongodb.net/phonebookApp?appName=Cluster0'

mongoose.set('strictQuery', false)
mongoose.connect(url)

// 3. The SCHEMA (The Blueprint)
// This says: "Every person MUST have a name and a number, and they are strings."
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// 4. The MODEL (The Constructor)
// This creates the class 'Person'. Mongo will automatically look for a collection named 'people' (lowercase plural).
const Person = mongoose.model('Person', personSchema)

// 5. Create a new Object
const person = new Person({
  name: 'Test Person',
  number: '123-456',
})

// 6. Save it to the cloud
person.save().then(() => {
  console.log('person saved!')
  mongoose.connection.close()
})