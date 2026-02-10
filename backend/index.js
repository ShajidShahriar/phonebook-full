const express = require("express");
const morgan = require('morgan')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phoneBook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
const generateId = () => {
  const maxId =
    phoneBook.length > 0 ? Math.max(...phoneBook.map((n) => n.id)) : 0;
  return String(maxId + 1);
};

//routes

//get info
app.get("/info", (req, res) => {
  const count = phoneBook.length;
  const date = new Date();
  res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
    `);
});

//get persons
app.get("/api/persons", (req, res) => {
  res.json(phoneBook);
});
//get person
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phoneBook.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});
//delete person
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  phoneBook = phoneBook.filter((person) => person.id !== id);
  res.status(204).end();
});
//add person
app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const nameExists = phoneBook.find((person) => person.name === body.name);
  if (nameExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  phoneBook = phoneBook.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
