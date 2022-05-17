import PersonModel from "../models/Person.js";
// import mongoose from 'mongoose';

export const addPerson = async (request, response, next) => {
 
  try {
    const newPerson = new PersonModel(request.body);
    await newPerson.save();
    response.send({msg:"new Person added!", newPerson});
    
  } catch (error) {
    response.send(error.message);
  }
}

export const updatePerson =  async (request, response, next) => { 
  // mongoose.set('debug', true); // gibt uns BEfehle in console aus, die mongoose ausführt

  const id = request.params.id;

  try {
    const res = await PersonModel.updateOne({_id: id}, request.body, {runValidators: true});
    // mit purem mongodb müssten wir id in ObjectId umwandeln
    // => .updateOne({_id: ObjectId(id)})
    // mongoose übernimmt es aber für uns
    // .updateOne returned uns ein Object mit metaInfos, wie z.B. "modifiedCount": 1,
   
   
    //Todo: anschauen, Unterschied klären
    const updatedPerson = await PersonModel.findByIdAndUpdate({_id: id}, request.body, {runValidators: true});
    //. findByIdAndUpdate returend uns das geupdatete Document bzw Model
    // findByIdAndUpdate sinnvoll, wenn ich mit dem PersonModel weiterarbeiten möchte

    response.send(res);
  } catch (error) {
    response.send(error.message)
  }

};