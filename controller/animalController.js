import AnimalModel from '../models/Animal.js'
import mongoose from 'mongoose';  // für debugger.


const getAllAnimals = async (req, res) =>{
  const allAnimals = await AnimalModel.find();
  res.send(allAnimals)
}

const getSingleAnimal = async (req, res) =>{
  const id = req.params.id;
  const animal = await AnimalModel.findById(id);
  res.send(animal);
}

const addAnimal = async (req, res) => {
    const newAnimal = new AnimalModel(req.body);
    await newAnimal.save();
    res.send('new animal added!!')
}

const updateAnimal = async (req, res) => {
  const id = req.params.id;
  await AnimalModel.findByIdAndUpdate(id, req.body);
  res.send('animal updated!!')
// durchläuft keine Validierung
}

const deleteAnimal = async (req, res) =>{
  const id = req.params.id;
  await AnimalModel.findByIdAndDelete(id);
  res.send('animal deleted')
}

export {getAllAnimals, addAnimal, deleteAnimal, getSingleAnimal, updateAnimal};