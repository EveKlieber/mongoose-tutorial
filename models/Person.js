import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: {
    type: String, // BSP: "Konrad-Adenauer-Str. 5" (Hausnummer speichern wir hier auch)
    minlength: 5 // street String muss mindestens 5 Zeichen haben
  },
  city: {
    type: {
      code: Number, // (code bedeutet hier Postleitzahl)
      name: {type: String, required: true}, // hier ist jetzt name verpflichtend => wir brauchen required => ich muss type verwenden
    },
    _id: false 
  },

  // "Sonderfall" eigenes Feld namens "type" (type eigentlich Schlüsselwort von mongoose)
  type: { //=> hier haben wir eigenes field mit dem namen "type"  (=> es könnte also auch z.B "addressType" heißen) ...
    type: String, //.. und mit dem typen "String"
    enum: ["DE", "US"] // => type darf nur die Strings "DE" und "US" enthalten
  },
  _id: false  // bekommt sonst automatisch weitere id von mongoose
});
// Beispiel Teildocument nur für Street
const exampleAdress = {
  street: "Schönhauser Allee 25",
  city: {
    code: 10456,
    name: "Berlin"
  },
  type: "DE",
  _id: false 
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Unknown" // => Person hat name "Unknown", wenn wir beim Erzeugen keinen Wert mitgeben
  },
  email: {
    type: String,
    required: true,
    unique: true, // jede E-Mail muss einzigartig sein
    trim: true // Leerzeichen am Anfang und Ende des String werden entfernt
  },
  // something:type {
  //   some1: String,
  //   some2: Number
  // },
  address: {
    type: addressSchema, // das Schema haben wir hier in "addressSchema" ausgelagert. Man könnte es aber auch direkt reinschreiben
    required: true // address field ist required
  },
  // age: Number
  age: {
    type: Number,
    validate: {
      validator: value => Number.isInteger(value), // Funktion, die meinen Wert überprüft und entweder true oder false zurückgeben muss
      message: "Age muss eine ganze Zahl (Int) enthalten" // Nachricht, die sich im Error befindet, wenn die Validierung fehl schlägt (wegen ungültigem Wert)
    },
    required: true
  },
   // Todo: nachher
   createdAt: {},
   updatedAt: {}
})

const examplePersonDoc = {
  name: "Regina Pawloski",
  email: "regina@gmail.de",
  address: exampleAdress,
  age: 75
}


export default mongoose.model("Person", personSchema)  // steht people drin. weil mongoose mehrzahl macht. wir können einen collection nach.
// "Person" ist der ausgangspunkt für die collection falls wir nichts anders voergeben.