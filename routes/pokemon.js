import express from "express";
import {
  updatePokemon,
  getAllPokemon,
  addPokemon,
  deletePokemon,
  getSinglePokemon,
} from "../controller/pokemonController.js";

const router = express.Router();

router.route("/")
  .get(getAllPokemon)
  .post(addPokemon);

router
  .route("/:id")
  .delete(deletePokemon)
  .get(getSinglePokemon)
  .put(updatePokemon);

export default router;
