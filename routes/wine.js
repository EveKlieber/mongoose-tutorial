import express from 'express';
import {addWine, updateWine, getAllWines, getSingleWine} from '../controller/wineController.js'
const router = express.Router();

router.route("/")
  .post(addWine)
  .get(getAllWines)
  .get(getSingleWine)
  

  

  router
  .route("/:id")
  .patch(updateWine);


export default router;