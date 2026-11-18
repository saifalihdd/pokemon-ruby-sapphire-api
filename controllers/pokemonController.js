import * as pokemonService from "../services/pokemonService.js";

const handleError = (res, error) => {
  const status = error.status || 500;
  const message = status === 500 ? "Terjadi kesalahan pada server" : error.message;
  if (status === 500) console.error(error);
  res.status(status).json({ success: false, message });
};

export const create = async (req, res) => {
  try {
    const data = await pokemonService.createPokemon(req.body);
    res.status(201).json({ success: true, message: "Pokemon berhasil ditambahkan", data });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAll = async (req, res) => {
  try {
    const data = await pokemonService.getAllPokemon(req.query);
    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const getById = async (req, res) => {
  try {
    const data = await pokemonService.getPokemonById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const update = async (req, res) => {
  try {
    const data = await pokemonService.updatePokemon(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Pokemon berhasil diperbarui", data });
  } catch (error) {
    handleError(res, error);
  }
};

export const remove = async (req, res) => {
  try {
    const data = await pokemonService.deletePokemon(req.params.id);
    res.status(200).json({ success: true, message: "Pokemon berhasil dihapus", data });
  } catch (error) {
    handleError(res, error);
  }
};

export const evolve = async (req, res) => {
  try {
    const data = await pokemonService.evolvePokemon(req.params.id);
    res.status(200).json({ success: true, message: "Pokemon berhasil berevolusi", data });
  } catch (error) {
    handleError(res, error);
  }
};