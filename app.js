import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import indexRouter from './routes/index.js'
import pokemonRouter from './routes/pokemon.js';
import personRouter from './routes/person.js';
import wineRouter from './routes/wine.js';
import animalRouter from './routes/animal.js';


// DATENBANK CONNECTION
const userName = 'Eve'
const password = process.env.mongo_db_pwd
const dbName = "pokemon-app"
const cluster = 'cluster0.iekwj.mongodb.net'

mongoose.connect(`mongodb+srv://${userName}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`, {
  useNewUrlParser: true, // benutz keine optionen die eh bald rausfliegen (deprecated sind)
  useUnifiedTopology: true
})

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