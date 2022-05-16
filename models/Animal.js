import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  foods: {
    likes: {
      type: String,
      enum: ["tuna", "meat"],
    },
    dislikes: {
      type: String,
      enum: ["paprika", "potatoes"],
    },
  },
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
    type: number,
    default: 0,
    required: true,
    min: 2000,
    max: 2023,

    validator: (v) => v % 2 === 0,
    message: (props) => `${props.value} is not an even number`,
  },
  foods: {
    type: FoodSchema,
    required: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },

  updatedAt: {
    type: Date,
    default: () => {
      console.log("default value of updatedAt set");
      return new Date();
    },
  },
});

const exampleAnimalDoc = {
  species: "CAT",
  name: "Sissi",
  birthyear: 2020,
  foods: { likes: "tuna", dislikes: "paprika" },
  createdAt: now(),
};

export default mongoose.model("AnimalSchema", AnimalSchema);

// playSchema.pre("save", function (next) {
//   this.updatedAt = newDate();
//   next();
// });
