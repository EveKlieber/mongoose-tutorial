import express from 'express';
import {addPerson, updatePerson} from '../controller/personController.js'
const router = express.Router();

router.route("/")
  .post(addPerson);


  router
  .route("/:id")
  .patch(updatePerson);


export default router;