const express = require("express");
const app = express();
app.use(express.json());
var morgan = require("morgan");
app.use(express.static("dist"));
require("dotenv").config();
const Person = require("./models/person");

morgan.token("person", function (request, response) {
  return JSON.stringify(request.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :person"
  )
);
app.get("/api/persons", (request, response, next) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});
app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((eachPerson) => {
      if (eachPerson) {
        response.json(eachPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      return response.status(204).end;
    })
    .catch((error) => next(error));
});
app.put("/api/persons/:id", (request, response, next) => {
  const newPerson = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name: newPerson.name, number: newPerson.number },
    { new: true, runValidators: true }
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});
app.post("/api/persons", (request, response, next) => {
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
    person
      .save()
      .then((savedPerson) => {
        response.json(savedPerson);
      })
      .catch((error) => next(error));
  });
});
app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      const date = new Date();
      response.send(`<p>Phonebook has info for ${count} people</p>
    <p>${date}</p>`);
    })
    .catch((error) => next(error));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${3001}`);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malfomatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);
