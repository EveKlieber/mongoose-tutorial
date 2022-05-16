import express from "express";
import {
  updateAnimal,
  getAllAnimals,
  addAnimal,
  deleteAnimal,
  getSingleAnimal,
} from "../controller/animalController.js";

const router = express.Router();

router.route("/")
  .get(getAllAnimals)
  .post(addAnimal);

router
  .route("/:id")
  .delete(deleteAnimal)
  .get(getSingleAnimal)
  .patch(updateAnimal);

export default router;
