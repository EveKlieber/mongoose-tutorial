import express, { Router } from 'express';
const router = express.Router();


router.get("/", (req, res, next) => {
  res.status(200).send('<h1>willkommen auf meiner seite</h1>')
})


export default router;