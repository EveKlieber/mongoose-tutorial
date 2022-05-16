import mongoose from 'mongoose';

// das schema ist dazu da zu beschreiben wie unsere Daten auszusehen haben.
const Pokemon = new mongoose.Schema({  // neue Instanz der klasse mongoose schema
  name: {
      type: String,
      required: true
  },
  hp: {
      type: Number,
      required: true
  },
  level: {
      type: Number,
      required: true
  },
  attacks: {
      type: Array,
      required: true
  }

}, {collection: "pokemon"})

// das Model ist der tatsächliche schnittstelle zur Datenbank.
export default mongoose.model('Pokemon', Pokemon);