import mongoose from "mongoose";

const WineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      // maxlength: 50,
      required: true,
    },
    year: {
      
        type: Number, // jahrgang.
        // minlength: 4,  // geht nur bei string.
        required: true,
        min: 1000,
        max: 2023,
          },
    type: {
      type: String,
      enum: ["red", "white", "sparkling", "rose"],
      required: true,
    },
    // _id: false,
    available_quantity: {
      type: Number,
      validate: {
        validator: (value) => Number.isInteger(value), // Funktion, die meinen Wert überprüft und entweder true oder false zurückgeben muss
        message: "Anzahl muss eine ganze Zahl (Int) enthalten", // Nachricht, die sich im Error befindet, wenn die Validierung fehl schlägt (wegen ungültigem Wert)
      },
      required: true,
    },
  },
  { collection: "myWine" }
);

const exampleWineDoc = {
  name: "Chateau Petrus",
  year: 1956,
  type: "red",
  available_quantity: 5,
};


export default mongoose.model("WineModel", WineSchema); 



