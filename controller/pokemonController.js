import pokemonModel from '../models/Pokemon.js'

const getAllPokemon = async (req, res) =>{
  const allPokemon = await pokemonModel.find();
  res.send(allPokemon)
}

const getSinglePokemon = async (req, res) =>{
  const id = req.params.id;
  const pokemon = await pokemonModel.findById(id);
  res.send(pokemon);
}

const addPokemon = async (req, res) => {
    const newPokemon = new pokemonModel(req.body);
    await newPokemon.save();
    res.send('new pokemon added!!')
}

const updatePokemon = async (req, res) => {
  const id = req.params.id;
  await pokemonModel.findByIdAndUpdate(id, req.body);
  res.send('pokemon updated!!')
// durchläuft keine Validierung
}


const deletePokemon = async (req, res) =>{
  const id = req.params.id;
  await pokemonModel.findByIdAndDelete(id);
  res.send('pokemon deleted')
}



export {getAllPokemon, addPokemon, deletePokemon, getSinglePokemon, updatePokemon};