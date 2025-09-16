const express = require("express");
var morgan = require("morgan");
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));
require("dotenv").config();
const Person = require("./models/person");
let persons = [
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
morgan.token("person", function (request, response) {
  return JSON.stringify(request.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
  response.json(persons);
});
app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});
app.post("/api/persons", (request, response) => {
  const newPerson = request.body;
  if (!newPerson.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  } else if (!newPerson.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }
  Person.findOne({ name: newPerson.name }).then((existingPerson) => {
    if (existingPerson) {
      return response.status(400).json({ error: "name must be unique" });
    }
    const person = new Person({
      name: newPerson.name,
      number: newPerson.number,
    });
    person.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  });
});
app.get("/info", (request, response) => {
  const count = persons.length;
  const date = new Date();
  console.log(count, date);
  response.send(`<p>Phonebook has info for ${count} people</p>
    <p>${date}</p>`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${3001}`);
