import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import indexRouter from './routes/index.js'
import pokemonRouter from './routes/pokemon.js';
import personRouter from './routes/person.js';
import wineRouter from './routes/wine.js';
import animalRouter from './routes/animal.js';
import Person from './models/Person.js';
import { testingAdd } from './models/Animal.js'
import { testingUpdate } from './models/Animal.js'

// Mongoose Einstellung
// mongoose.set('debug', true);  // Mongoose zeigt in console, welche BEfehle es aufruft



// DATENBANK CONNECTION
const userName = 'Eve'
const password = process.env.mongo_db_pwd
const dbName = "pokemon-app"
const cluster = 'cluster0.iekwj.mongodb.net'

await mongoose.connect(`mongodb+srv://${userName}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority` )

const app = express();

app.use(express.json()); // Bodyparser um aus der app was zu lesen.
app.use("/", indexRouter);
app.use("/pokemon", pokemonRouter)
app.use("/person", personRouter)
app.use("/wine", wineRouter)
app.use("/animal", animalRouter)

app.listen(3000, () => {
  console.log('app ist listening on port 3000')
})

// async function testMiddleware() {
//   // const Regina = new Person(examplePersonDoc);
//   try {
//     // await Regina.save(); // führt zu "mongoose save() aufgerufen" // => ruft unsere middleware nicht auf
//     // const res = await Regina.updateOne({name:"Regina Müller"}) // ruft unsere middleware nicht auf
//     // console.log({res})
//     // await Person.insert({ test: true });
//     await mongoose.connection.collection('people').insertOne({test: "Bin ich da?", email: "evi@gmail.com"})
//     console.log("saved");
//   } catch (error) {
//     console.log(error);
//   }
// }
// testMiddleware()

// {
//   useNewUrlParser: true, // benutz keine optionen die eh bald rausfliegen (deprecated sind)
//   useUnifiedTopology: true
// }