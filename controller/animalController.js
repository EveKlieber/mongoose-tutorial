import AnimalModel from '../models/Animal.js'
import mongoose from 'mongoose';  // für debugger.


const getAllAnimals = async (req, res) =>{
  const allAnimals = await AnimalModel.find();
  res.send(allAnimals)
}

const getSingleAnimal = async (req, res) =>{
  const id = req.params.id;
  const animal = await AnimalModel.findById(id);
  const date = new Date("2022-05-16T09:03:20.045Z").getFullYear()
  console.log(date)
  console.log(animal.ageVirtual)
  res.send({    
    age: animal.ageVirtual,
    animal, 
  });
}

const addAnimal = async (req, res) => {
  try {
    const newAnimal = new AnimalModel(req.body);
    await newAnimal.save();
    res.send('new animal added!!')
  } catch (error ) {
    res.send(error.message)
  }
}

const updateAnimal = async (req, res) => {
  const id = req.params.id;
  const updatedAnimal = await AnimalModel.findByIdAndUpdate(id, req.body);
  res.send(updatedAnimal)
// durchläuft keine Validierung
}

const deleteAnimal = async (req, res) =>{
  const id = req.params.id;
  await AnimalModel.findByIdAndDelete(id);
  res.send('animal deleted')
}

export {getAllAnimals, addAnimal, deleteAnimal, getSingleAnimal, updateAnimal};