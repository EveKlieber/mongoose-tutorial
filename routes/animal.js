import express from "express";
import {
  updateAnimal,
  getAllAnimal,
  addAnimal,
  deleteAnimal,
  getSingleAnimal,
} from "../controller/animalController.js";

const router = express.Router();

router.route("/")
  .get(getAllAnimal)
  .post(addAnimal);

router
  .route("/:id")
  .delete(deleteAnimal)
  .get(getSingleAnimal)
  .put(updateAnimal);

export default router;
