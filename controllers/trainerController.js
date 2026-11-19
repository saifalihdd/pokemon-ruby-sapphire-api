import * as trainerService from "../services/trainerService.js";
import { handleError } from "../utils/handleError.js";

export const create = async (req, res) => {
  try {
    const data = await trainerService.createTrainer(req.body ?? {});
    res.status(201).json({ success: true, message: "Trainer berhasil ditambahkan", data });
  } catch (error) {
    handleError(res, error);
  }
};

export const getAll = async (req, res) => {
  try {
    const { items, pagination } = await trainerService.getAllTrainers(req.query);
    res.status(200).json({ success: true, count: items.length, pagination, data: items });
  } catch (error) {
    handleError(res, error);
  }
};

export const getById = async (req, res) => {
  try {
    const data = await trainerService.getTrainerById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const getPokemon = async (req, res) => {
  try {
    const data = await trainerService.getTrainerPokemon(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};

export const update = async (req, res) => {
  try {
    const data = await trainerService.updateTrainer(req.params.id, req.body ?? {});
    res.status(200).json({ success: true, message: "Trainer berhasil diperbarui", data });
  } catch (error) {
    handleError(res, error);
  }
};

export const remove = async (req, res) => {
  try {
    const { trainer, releasedPokemon } = await trainerService.deleteTrainer(req.params.id);
    res.status(200).json({
      success: true,
      message: "Trainer berhasil dihapus. Pokemon miliknya dilepas dan tidak lagi punya trainer",
      releasedPokemon,
      data: trainer,
    });
  } catch (error) {
    handleError(res, error);
  }
};
