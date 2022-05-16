import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  likes: [
    {
      type: String,
    },
  ],
  dislikes: [
    {
      type: String,
    },
  ],
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
  name: {
    type: String,
    default: "Unknown",
  },
  birthyear: {
    type: Number,
    default: 0,
    required: true,
    min: 2000,
    max: 2023,

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

AnimalSchema.pre("findByIdAndUpdate", function (next) {
  // vpr dem speichern wird diese middleware zwischengespeichert,
  // hört auf save (darf keine array func sein)
  this.updatedAt = new Date();
  // this.updatedAt = Date.now();
  console.log("pre läuft");
  next();
});

AnimalSchema.virtual("ageVirtual").get( function () {
  const date = new Date(this.createdAt).getFullYear()
  return this.birthYear - date;
});

const exampleAnimalDoc = {
  species: "CAT",
  name: "Sissi",
  birthyear: 2020,
  foods: { likes: "tuna", dislikes: "paprika" },
  createdAt: Date.now(),
};

export default mongoose.model("AnimalsCollection", AnimalSchema);
