import WineModel from "../models/Wine.js";
import mongoose from 'mongoose';


export const getAllWines = async (req, res) =>{
  const allWines = await WineModel.find();
  res.send(allWines)
}

export const getSingleWine = async (req, res) =>{
  const id = req.params.id;
  const singleWine = await WineModel.findById(id);
  res.send(singleWine);
}





export const addWine = async (request, response, next) => {

  try {
    const newWine = new WineModel(request.body);
    await newWine.save();
    response.send({msg:"new wine added!", newWine});
    
  } catch (error) {
    response.send(error.message);
  }
}

export const updateWine =  async (request, response, next) => { 
  mongoose.set('debug', true); // gibt uns BEfehle in console aus, die mongoose ausführt

  const id = request.params.id;

  try {
    const res = await WineModel.updateOne({_id: id}, request.body, {runValidators: true});
    // mit purem mongodb müssten wir id in ObjectId umwandeln
    // => .updateOne({_id: ObjectId(id)})
    // mongoose übernimmt es aber für uns
    // .updateOne returned uns ein Object mit metaInfos, wie z.B. "modifiedCount": 1,
   
   

    //Todo: anschauen, Unterschied klären
    // const updatedPerson = await PersonModel.findByIdAndUpdate({_id: id}, request.body, {runValidators: true});
    //. findByIdAndUpdate returend uns das geupdatete Document bzw Model
    // findByIdAndUpdate sinnvoll, wenn ich mit dem PersonModel weiterarbeiten möchte

    response.send(res);
  } catch (error) {
    response.send(error.message)
  }

};