import mongoose from "mongoose";
import Species from "../models/Species.js";

const FoodSchema = new mongoose.Schema({
  likes: [String],
  dislikes: [String],
  _id: false,
});

const AnimalSchema = new mongoose.Schema({
  species: {
    type: String,
    default: "CAT",
    minLength: 3,
    maxLength: 15,
    required: true,
    uppercase: true,
  },
  speciesId: {
    type: mongoose.Schema.Types.Mixed,
    ref: Species,
    default: "",
  },
  name: {
    type: String,
    default: "Unknown",
  },
  birthyear: {
    type: Number,
    default: 0,
    required: true,
    min: 2000,
    max: new Date().getFullYear(), // maximal bis heute
    // validator: (v) => v % 2 === 0,
    // message: (props) => `${props.value} is not an even number`,
    validate: {
      validator: (value) => Number.isInteger(value), // Funktion, die meinen Wert überprüft und entweder true oder false zurückgeben muss
      message: "year needs to be an integer",
    },
  },
  foods: {
    type: FoodSchema,
    // required: true,
  },

  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(), // timestamp ab 1.1.1970
  },

  updatedAt: {
    type: Date,
    default: () => {
      console.log("default value of updatedAt set");
      return new Date();
    },
  },
});

// middleware
// ZIEL: wird jedes mal aufgerufen, bevor .save() und .findOneAndUpdate ausgeführt werden
// => setzt also updatedAt automatisch auf das aktuelle Datum beim Speichern und Updaten

// für findOneAndUpdate:
// Da findOneAndUpdate(...) eine Methode des Models bzw Model-Klasse ist ( hier: Animal.findOneAndUpdate(...) )
// kann man nicht direkt auf "this.updatedAt" in der middleware zugreifen.
// Daher stellt uns mongoose "set" zur Verfügung

AnimalSchema.pre("findOneAndUpdate", function (next) {
  // vpr dem speichern wird diese middleware zwischengespeichert,
  // hört auf save (darf keine array func sein)
  this.set({ updatedAt: new Date() });

  console.log("pre läuft");
  next();
});

// für save()
// .save() wird auf der Instanz von Animal ausgeführt
// (z.b. myAnimal = new Animal({...}); myAnimal.save() ).
// Daher können wir hier direkt mit
// this.updatedAt (ohne set) arbeiten
AnimalSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// AnimalSchema.virtual("ageVirtual").get(function () {
//   return new Date(this.updatedAt).getFullYear() - this.birthYear;
// });

AnimalSchema.virtual("age")
  .get(function () {
  const ageVirtual = new Date().getFullYear() - this.birthyear;
  return ageVirtual;
});

// AnimalSchema.virtual('age')
//   .get(function(){
//     return new Date(this.updatedAt).getFullYear() - this.birthYear
//   })


const exampleAnimalDoc = {
  species: "CAT",
  name: "Sissi",
  birthyear: 2020,
  foods: { likes: "tuna", dislikes: "paprika" },
  createdAt: Date.now(),
};

const AnimalModel = mongoose.model("AnimalsCollection", AnimalSchema);
export default AnimalModel;

// testen:

// {
//   "_id": "62826a88e64ed21f70760e1f",
//   "species": "DOG",
//   "name": "xxxx Mario",
//   "birthyear": 2010,
//   "foods": {
//     "likes": [
//       "tuna"
//     ],
//     "dislikes": [
//       "paprika"
//     ]
//   },
//   "createdAt": "2022-05-16T15:15:20.324Z",
//   "updatedAt": "2022-05-16T15:15:20.344Z",
//   "__v": 0
// }

// *** testen ***
// Voraussetzung: Diese datei sollte z.B. in app.js importiert werden, damit sie überhaupt
// ausgeführt wird
export async function testingAdd() {
  const meowaska = new AnimalModel({
    name: "Meowaska",
    species: "cat",
    speciedId: "", //eigentlich unnötig, da defaultwert
    birthyear: 2018,
  });

  try {
    await meowaska.save();
    console.log("MyAnimal saved");
  } catch (error) {
    console.error(error);
  }

  // Noch virtual age testen:
  console.debug("Age of Animal: ", meowaska.ageVirtual);
}

export async function testingUpdate() {
  let meowaska;
  try {
    meowaska = await AnimalModel.findOne({ name: "Meowaska" });
    meowaska.name = "Pani Meaowaska";
    meowaska.save();
    console.log("MyAnimal updated");
  } catch (error) {
    console.error(error);
  }
}
// name: "miauuuuuuuuuuuuuuuuuuuu",

async function testPopulate() {
  try {
    const catPopulated = await AnimalModel
      .where("name")  // find wäre auch möglch wird aber schnell unübersichtlich.{}
      .equals("miauuuuuuuuuuuuuuuuuuuu")
      // .populate("speciesId"); // gibt mir alle daten aus Species.
      .populate("speciesId", "name cmAverageHeight -_id") 
      // zweiter PArameter in populate entspricht select: gebe mir nur name und cmAverageHeight, ohne id
    console.log(catPopulated);

  } catch (error) {
    console.error(error);
  }
}
// testPopulate();

// async function getAnimalWithSpecId(){
//   const animalSpecs = await AnimalModel.where("speciesId").exists(true); // alle Personen, die das Feld favoriteWines haben

//   const animalSpecsPopulated = await AnimalModel
//     .where("speciesId")
//     .exists(true)
//     .populate("name"); // wandelt die ObjectIds in "favoriteWines" in das entsprechende Document mit der ID um

//   console.log( "spec : ", JSON.stringify(winePeopePopulated, null, 2) );

// }
// getAnimalWithSpecId()

// testingAdd();
// testingUpdate();



// virtual - nur wie ein Zwischenspeicher. erst nach save aufruf. 