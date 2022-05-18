import mongoose from "mongoose";

const speciesSchema = mongoose.Schema({
  name: String,
  kgAverageWeight: Number,
  cmAverageHeight: Number,
  hAverageSleep: Number,
}, {collection: "species"});

export default mongoose.model("Species", speciesSchema);
