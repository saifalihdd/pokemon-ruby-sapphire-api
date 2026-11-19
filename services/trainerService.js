import Trainer from "../models/Trainer.js";
import Pokemon from "../models/Pokemon.js";
import { MAX_BADGES } from "../config/constants.js";
import { httpError } from "../utils/httpError.js";
import { parsePagination, buildPagination, getString, escapeRegex } from "../utils/query.js";
import { assertValidId } from "../utils/validators.js";
import { withSpecies } from "../utils/presenter.js";

const SORT_OPTIONS = {
  name: { name: 1, _id: 1 },
  "-name": { name: -1, _id: 1 },
  newest: { createdAt: -1, _id: 1 },
  oldest: { createdAt: 1, _id: 1 },
};

const validateFields = ({ name, hometown, badges }) => {
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 20) {
      throw httpError(400, "Nama trainer wajib diisi, 2-20 karakter");
    }
  }
  if (hometown !== undefined && hometown !== null) {
    if (typeof hometown !== "string" || hometown.trim().length > 30) {
      throw httpError(400, "Hometown maksimal 30 karakter");
    }
  }
  if (badges !== undefined) {
    if (!Number.isInteger(badges) || badges < 0 || badges > MAX_BADGES) {
      throw httpError(400, `Badges harus bilangan bulat 0-${MAX_BADGES}`);
    }
  }
};

const requireTrainer = async (id) => {
  assertValidId(id);
  const trainer = await Trainer.findById(id);
  if (!trainer) throw httpError(404, "Trainer tidak ditemukan");
  return trainer;
};

export const createTrainer = async (body) => {
  validateFields(body);
  if (body.name === undefined) throw httpError(400, "Nama trainer wajib diisi, 2-20 karakter");
  const { name, hometown = null, badges = 0 } = body;
  return Trainer.create({ name, hometown, badges });
};

// Query: search (nama), hometown, sort, page, limit
export const getAllTrainers = async (query) => {
  const search = getString(query.search);
  const hometown = getString(query.hometown);
  const sort = getString(query.sort) ?? "newest";
  const { page, limit, skip } = parsePagination(query);

  if (!SORT_OPTIONS[sort]) throw httpError(400, "sort harus salah satu dari: name, -name, newest, oldest");

  const filter = {};
  if (search) filter.name = { $regex: escapeRegex(search), $options: "i" };
  if (hometown) filter.hometown = { $regex: escapeRegex(hometown), $options: "i" };

  const [items, totalItems] = await Promise.all([
    Trainer.find(filter).sort(SORT_OPTIONS[sort]).skip(skip).limit(limit),
    Trainer.countDocuments(filter),
  ]);
  return { items, pagination: buildPagination(page, limit, totalItems) };
};

export const getTrainerById = async (id) => {
  const trainer = await requireTrainer(id);
  const [partyCount, boxCount] = await Promise.all([
    Pokemon.countDocuments({ trainerId: trainer._id, storage: "party" }),
    Pokemon.countDocuments({ trainerId: trainer._id, storage: "box" }),
  ]);
  return { ...trainer.toObject(), partyCount, boxCount };
};

export const getTrainerPokemon = async (id) => {
  const trainer = await requireTrainer(id);
  const docs = await Pokemon.find({ trainerId: trainer._id }).sort({ createdAt: 1, _id: 1 });
  const party = docs.filter((d) => d.storage === "party").map(withSpecies);
  const box = docs.filter((d) => d.storage === "box").map(withSpecies);
  return { trainer, partyCount: party.length, boxCount: box.length, party, box };
};

export const updateTrainer = async (id, body) => {
  const trainer = await requireTrainer(id);
  const { name, hometown, badges } = body;
  if (name === undefined && hometown === undefined && badges === undefined) {
    throw httpError(400, "Isi minimal salah satu: name, hometown, badges");
  }
  validateFields(body);

  if (name !== undefined) trainer.name = name;
  if (hometown !== undefined) trainer.hometown = hometown;
  if (badges !== undefined) trainer.badges = badges;

  await trainer.save();
  return trainer;
};

// Menghapus trainer tidak menghapus Pokemon-nya; Pokemon dilepas (trainerId dan storage jadi null)
export const deleteTrainer = async (id) => {
  assertValidId(id);
  const trainer = await Trainer.findByIdAndDelete(id);
  if (!trainer) throw httpError(404, "Trainer tidak ditemukan");
  const { modifiedCount } = await Pokemon.updateMany({ trainerId: trainer._id }, { trainerId: null, storage: null });
  return { trainer, releasedPokemon: modifiedCount };
};
