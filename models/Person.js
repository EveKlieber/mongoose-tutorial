import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street: {
    type: String, // BSP: "Konrad-Adenauer-Str. 5" (Hausnummer speichern wir hier auch)
    minlength: 5, // street String muss mindestens 5 Zeichen haben
  },
  city: {
    type: {
      code: Number, // (code bedeutet hier Postleitzahl)
      name: { type: String, required: true }, // hier ist jetzt name verpflichtend => wir brauchen required => ich muss type verwenden
    },
    _id: false, // ohne bekommt city automatisch _id von mongoose (da verschachteltes dokument)
  },

  // "Sonderfall" eigenes Feld namens "type" (type eigentlich Schlüsselwort von mongoose)
  type: {
    //=> hier haben wir eigenes field mit dem namen "type"  (=> es könnte also auch z.B "addressType" heißen) ...
    type: String, //.. und mit dem typen "String"
    enum: ["DE", "US"], // => type darf nur die Strings "DE" und "US" enthalten
  },

  _id: false, // ohne bekommt street automatisch _id von mongoose (da verschachteltes dokument)
});
// Beispiel Teildocument nur für Street
const exampleAdress = {
  street: "Schönhauser Allee 25",
  city: {
    code: 10456,
    name: "Berlin",
  },
  type: "DE",
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Unknown", // => Person hat name "Unknown", wenn wir beim Erzeugen keinen Wert mitgeben
  },
  email: {
    type: String,
    required: true,
    unique: true, // jede E-Mail muss einzigartig sein
    trim: true, // Leerzeichen am Anfang und Ende des String werden entfernt
  },
  address: {
    type: addressSchema, // das Schema haben wir hier in "addressSchema" ausgelagert. Man könnte es aber auch direkt reinschreiben
    required: true, // address field ist required
  },

  age: {
    type: Number,
    validate: {
      validator: (value) => Number.isInteger(value), // Funktion, die meinen Wert überprüft und entweder true oder false zurückgeben muss
      message: "Age muss eine ganze Zahl (Int) enthalten", // Nachricht, die sich im Error befindet, wenn die Validierung fehl schlägt (wegen ungültigem Wert)
    },
    required: true,
  },

  createdAt: {
    type: Date,
    default: () => new Date(), // new Date wird erst aufgerufen, wenn man eine neue Instanz von Person erzeugt
    immutable: true, // der Wert kann nur einmal gesetzt und dann nicht mehr verändert werden
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

const examplePersonDoc = {
  name: "Regina Pawloski",
  email: "regina_new99@gmail.de",
  address: exampleAdress,
  age: 25,
};

//*** middleware zum Model hinzufügen ***
// personSchema.pre(['save','updateOne'], function(next){
//   // Diese Callback-Function wird jedes mal vor dem aufruf von .save() und .updateOne ausgeführt
//   console.debug('mongoose save() oder updateOne() aufgerufen');

//   this.updatedAt = new Date(); // Eigentlich müsste die FUnktion wegen updateOne "this.set(...)" aufrufen

//   next(); // ohne next würde save() niemals ausgeführt werden
// });

// *** virtual ***
// Ein virtuelles Feld zu unserem Schema hinzufügen, das nicht in der Datenbank existiert

personSchema.virtual("namedEmail").get(function () {
  return `${this.name} <${this.email}>`; // BSP: Regina Pawloski <regina_new4000@gmail.de>
});
const Person = mongoose.model("Person", personSchema);

function testVirtual() {
  const somePerson = new Person({
    name: "Person Pawloski",
    email: "Person_new4000@gmail.de",
    address: exampleAdress,
    age: 25,
  });
  console.log("somePerson.name", somePerson.name);
  console.log("somePerson.age", somePerson.age);
  console.log("somePerson.namedEmail", somePerson.namedEmail); // unser Virtuales Feld

  // firstName und LastName als virtualles feld = fullname
  // new Person({firstName: "Person", lastName:"Personlastname",email: "Person_new4000@gmail.de",address: exampleAdress, age: 25 })
  //   somePerson.fullName -> nützlich.
}
testVirtual();

export default Person;
// - mongoose erzeugt automatisch eine collection namens "people",
// da es keine Mehrzahl von Person git ("persons" wäre falsch)
// - jedoch könnten wir "new mongoose.Schema()"" einen zweiten Parameter
// mitgeben und die collection nach unseren Wünschen bennen
// z.B.const personSchema = new mongoose.Schema({...}, {collection: "users"})

// *** Testen ***

// Zum Testen der Middleware Erzeugen wir schon hier eine neue Instanz von Person
async function testMiddleware() {
  const Regina = new Person(examplePersonDoc);
  try {
    // await Regina.save(); // führt zu "mongoose save() aufgerufen" // => ruft unsere middleware nicht auf
    // const res = await Regina.updateOne({name:"Regina Müller"}) // ruft unsere middleware nicht auf
    // console.log({res})
    // await Person.insert({ test: true });
    await mongoose.connection.collection('people').insertOne({test: "Bin ich da?", email: "evi@gmail.com"})
    console.log("saved");
  } catch (error) {
    console.log(error);
  }
}
testMiddleware();
