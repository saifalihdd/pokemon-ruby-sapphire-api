import * as speciesService from "../services/speciesService.js";
import { handleError } from "../utils/handleError.js";

export const getAll = async (req, res) => {
  try {
    const { items, pagination } = speciesService.getAllSpecies(req.query);
    res.status(200).json({ success: true, count: items.length, pagination, data: items });
  } catch (error) {
    handleError(res, error);
  }
};

export const getById = async (req, res) => {
  try {
    const data = speciesService.getSpeciesById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    handleError(res, error);
  }
};
