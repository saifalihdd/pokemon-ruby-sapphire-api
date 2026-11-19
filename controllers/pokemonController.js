import * as pokemonService from "../services/pokemonService.js";
import { handleError } from "../utils/handleError.js";

export const create = async (req, res) => {
  try {
    const data = await pokemonService.createPokemon(req.body ?? {});
    res.status(201).json({ success: true, message: "Pokemon berhasil ditambahkan", data });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAll = async (req, res) => {
  try {
    const { items, pagination } = await pokemonService.getAllPokemon(req.query);
    res.status(200).json({ success: true, count: items.length, pagination, data: items });
  } catch (error) {
    handleError(res, error);
  }
};

export const getStats = async (req, res) => {
  try {
    const data = await pokemonService.getStats();
    res.status(200).json({ success: true, data });
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
    const data = await pokemonService.updatePokemon(req.params.id, req.body ?? {});
    res.status(200).json({ success: true, message: "Pokemon berhasil diperbarui", data });
  } catch (error) {
    handleError(res, error);
  }
};

export const train = async (req, res) => {
  try {
    const { pokemon, training } = await pokemonService.addExp(req.params.id, req.body ?? {});
    res.status(200).json({ success: true, message: "Training berhasil", training, data: pokemon });
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

export const assignTrainer = async (req, res) => {
  try {
    const data = await pokemonService.assignTrainer(req.params.id, req.body ?? {});
    res.status(200).json({ success: true, message: "Kepemilikan Pokemon berhasil diperbarui", data });
  } catch (error) {
    handleError(res, error);
  }
};

export const moveStorage = async (req, res) => {
  try {
    const data = await pokemonService.moveStorage(req.params.id, req.body ?? {});
    res.status(200).json({ success: true, message: "Pokemon berhasil dipindahkan", data });
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
