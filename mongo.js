// const mongoose = require("mongoose");

// if (process.argv.length < 3) {
//   console.log("give password as argument");
//   process.exit(1);
// }

// const password = process.argv[2];
// const name = process.argv[3];
// const number = process.argv[4];

// const url = `mongodb+srv://lidetvoeun:${password}@phonebook.fvhrohx.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=phonebook`;

// mongoose.set("strictQuery", false);

// mongoose.connect(url);
// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
// });
// const Person = mongoose.model("Person", personSchema);

// if (process.argv.length === 3) {
//   Person.find({}).then((persons) => {
//     console.log("phonebook:");
//     persons.forEach((person) => {
//       console.log(`
//         ${person.name} ${person.number}`);
//     });
//     mongoose.connection.close();
//   });
// } else if (process.argv.length === 5) {
//   const person = new Person({
//     name: name,
//     number: number,
//   });
//   person.save().then(() => {
//     console.log(`added ${name} number ${number} to the phonebook`);
//     mongoose.connection.close();
//   });
// } //else {
// //   console.log("Usage: node mongo.js <password> [name number]");
// //   process.exit(1);
// // }
