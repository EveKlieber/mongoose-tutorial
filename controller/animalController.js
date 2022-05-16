import AnimalModel from "../models/Animal.js";
import mongoose from "mongoose"; // für debugger.

const getAllAnimals = async (req, res) => {
  const allAnimals = await AnimalModel.find();
  res.send(allAnimals);
};

const getSingleAnimal = async (req, res) => {
  const id = req.params.id;
  const animal = await AnimalModel.findById(id);
  const date = new Date().getFullYear();
  console.log(date);
  console.log(animal.ageVirtual);
  res.send({
    age: animal.ageVirtual,
    animal,
  });
};

const addAnimal = async (req, res) => {
  try {
    const newAnimal = new AnimalModel(req.body);
    await newAnimal.save();
    res.send("new animal added!!");
  } catch (error) {
    res.send(error.message);
  }
};

const updateAnimal = async (req, res, next) => {
  const id = req.params.id;

  try {
    // const updatedAnimal = await AnimalModel.findByIdAndUpdate(id, req.body, {
      const updatedAnimal = await AnimalModel.findOneAndUpdate(id, req.body, {
        runValidators: true,
    });
    const age = updatedAnimal.age;
    res.status(200).send({
      msg: "animal updated!!",
      age,
      old_animal: updatedAnimal,
    });
  } catch (error) {
    res.status(500).send({
      error: error.message,
    });
  }
};
// / Denke daran das hier stets das vorherige Dokument ausgegeben wird, darum auch old_animal. Wenn du also eine änderung direkt sehen willst, mach entweder getOneAnimal, oder getAllAnimal oder hole dir die Daten im Compass


const deleteAnimal = async (req, res) => {
  const id = req.params.id;
  await AnimalModel.findByIdAndDelete(id);
  res.send("animal deleted");
};

export {
  getAllAnimals,
  addAnimal,
  deleteAnimal,
  getSingleAnimal,
  updateAnimal,
};
