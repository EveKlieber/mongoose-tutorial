import mongoose from "mongoose";
import myWine from "../models/Wine.js";

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
    // unique: true, // jede E-Mail muss einzigartig sein
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
  favoriteWines: [
    {
      // type: mongoose.SchemaTypes.ObjectId,
      type: mongoose.SchemaTypes.ObjectId,
      ref: myWine, // model muss importiert werden.
    },
  ],

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
  email: "regina_99@gmail.de",
  address: exampleAdress,
  age: 25,
};

//*** middleware zum Model hinzufügen ***
personSchema.pre(["save", "updateOne"], function (next) {
  // Diese Callback-Function wird jedes mal vor dem aufruf von .save() und .updateOne ausgeführt
  console.debug("mongoose save() oder updateOne() aufgerufen");

  this.updatedAt = new Date(); // Eigentlich müsste die FUnktion wegen updateOne "this.set(...)" aufrufen

  next(); // ohne next würde save() niemals ausgeführt werden
});

// *** virtual ***
// Ein virtuelles Feld zu unserem Schema hinzufügen, das nicht in der Datenbank existiert

personSchema.virtual("namedEmail").get(function () {
  return `${this.name} <${this.email}>`; // BSP: Regina Pawloski <regina_new4000@gmail.de>
});

const Person = mongoose.model("Person", personSchema);
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
  await Regina.save(); // führt zu "mongoose save() aufgerufen" // => ruft unsere middleware nicht auf
  const res = await Regina.updateOne({ name: "Regina Müller" }); // ruft unsere middleware nicht auf
  console.log({ res });
}
// testMiddleware();

function testVirtual() {
  const somePerson = new Person({
    name: "Person Pawloski",
    email: "Person_new4000@gmail.de",
    address: exampleAdress,
    age: 25,
  });
  console.log("somePerson.name", somePerson.name);
  console.log("somePerson.age", somePerson.age);
  console.log("somePerson.namedEmail", somePerson.namedEmail);
}
// testVirtual();

async function addPersonWithFavoriteWines() {
  const somePersonData = {
    name: "TOMAS Pawloski",
    email: "marc99@gmail.de",
    address: {
      street: "Schönhauser Allee 35",
      city: {
        code: 10456,
        name: "Berlin",
      },
      type: "DE",
    },
    age: 35,
    favoriteWines: ["62812144f3d2c9754b0c3ac4", "6281f29aa825ac821121b3fd"],
  };

  const somePerson = new Person(somePersonData);

  await somePerson.save();
  console.log("person saved");
}
// addPersonWithFavoriteWines();

async function getPersonWithFavoritWineInfos() {
  const winePeople = await Person.where("favoriteWines").exists(true); // alle Personen, die das Feld favoriteWines haben
  // console.log( "winePeople: ", JSON.stringify(winePeople, null, 2) );
  // hier haben wir zwar alle "weintrinkenden" Personen, aber in favoriteWines steht noch ausschließich die id.
  // bsp:  "favoriteWines": [199,265]

  // Jetzt: populate()
  // Mongoose soll für uns in der wine collection "nachschauen" und die ids durch die entspechenden Wine-Daten
  // ersetzen

  const winePeopePopulated = await Person
    .where("favoriteWines")
    .exists(true)
    .populate("favoriteWines");
  console.log(
    "winePeopePopulated: ",
    JSON.stringify(winePeopePopulated, null, 2)
  );
}
// getPersonWithFavoritWineInfos();
