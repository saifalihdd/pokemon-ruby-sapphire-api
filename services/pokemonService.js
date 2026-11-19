import Pokemon from "../models/Pokemon.js";
import Trainer from "../models/Trainer.js";
import { pokedex, findSpecies } from "../data/pokedex.js";
import { evolutions } from "../data/evolutions.js";
import { MAX_LEVEL, PARTY_LIMIT } from "../config/constants.js";
import { httpError } from "../utils/httpError.js";
import { calcMaxHp, calcStats, expForLevel, applyExp } from "../utils/pokemonCalc.js";
import { parsePagination, buildPagination, getString, escapeRegex } from "../utils/query.js";
import { assertValidId, assertValidLevel, assertValidNickname } from "../utils/validators.js";
import { withSpecies } from "../utils/presenter.js";

const SORT_OPTIONS = {
  level: { level: 1, _id: 1 },
  "-level": { level: -1, _id: 1 },
  newest: { createdAt: -1, _id: 1 },
  oldest: { createdAt: 1, _id: 1 },
};

// ---------- Helper ----------

const requireTrainer = async (trainerId) => {
  assertValidId(trainerId, "trainerId");
  const trainer = await Trainer.findById(trainerId);
  if (!trainer) throw httpError(404, "Trainer tidak ditemukan");
  return trainer;
};

// Pokemon baru masuk party jika masih ada slot, kalau penuh masuk box
const pickStorage = async (trainerId, excludePokemonId = null) => {
  const filter = { trainerId, storage: "party" };
  if (excludePokemonId) filter._id = { $ne: excludePokemonId };
  const partyCount = await Pokemon.countDocuments(filter);
  return partyCount < PARTY_LIMIT ? "party" : "box";
};

const requirePokemon = async (id) => {
  assertValidId(id);
  const doc = await Pokemon.findById(id);
  if (!doc) throw httpError(404, "Pokemon tidak ditemukan");
  return doc;
};

// ---------- CREATE ----------

export const createPokemon = async ({ speciesId, level = 5, nickname = null, heldItem = null, trainerId = null }) => {
  const species = findSpecies(speciesId);
  if (!species) throw httpError(400, `Spesies dengan id ${speciesId} tidak ditemukan`);
  assertValidLevel(level);
  assertValidNickname(nickname);

  let storage = null;
  if (trainerId !== null) {
    await requireTrainer(trainerId);
    storage = await pickStorage(trainerId);
  }

  const maxHp = calcMaxHp(species.baseStats.hp, level);
  const doc = await Pokemon.create({
    speciesId, nickname, level, heldItem, trainerId, storage,
    exp: expForLevel(level),
    hp: maxHp,
    maxHp,
    stats: calcStats(species, level),
  });
  return withSpecies(doc);
};

// ---------- READ ----------

// Query: search, type, trainerId, storage, minLevel, maxLevel, sort, page, limit
export const getAllPokemon = async (query) => {
  const search = getString(query.search);
  const type = getString(query.type);
  const sort = getString(query.sort) ?? "newest";
  const trainerId = getString(query.trainerId);
  const storage = getString(query.storage);
  const { page, limit, skip } = parsePagination(query);

  if (!SORT_OPTIONS[sort]) throw httpError(400, "sort harus salah satu dari: level, -level, newest, oldest");

  const filter = {};

  if (type) {
    const ids = pokedex.filter((s) => s.type.some((t) => t.toLowerCase() === type.toLowerCase())).map((s) => s.id);
    filter.speciesId = { $in: ids };
  }

  if (search) {
    const keyword = search.toLowerCase();
    const ids = pokedex.filter((s) => s.name.toLowerCase().includes(keyword)).map((s) => s.id);
    filter.$or = [{ speciesId: { $in: ids } }, { nickname: { $regex: escapeRegex(search), $options: "i" } }];
  }

  if (trainerId) {
    assertValidId(trainerId, "trainerId");
    filter.trainerId = trainerId;
  }

  if (storage) {
    if (!["party", "box"].includes(storage)) throw httpError(400, "storage harus party atau box");
    filter.storage = storage;
  }

  for (const [key, operator] of [["minLevel", "$gte"], ["maxLevel", "$lte"]]) {
    if (query[key] === undefined) continue;
    const value = Number(query[key]);
    if (!Number.isInteger(value)) throw httpError(400, `${key} harus bilangan bulat`);
    filter.level = { ...filter.level, [operator]: value };
  }

  const [docs, totalItems] = await Promise.all([
    Pokemon.find(filter).sort(SORT_OPTIONS[sort]).skip(skip).limit(limit),
    Pokemon.countDocuments(filter),
  ]);

  return { items: docs.map(withSpecies), pagination: buildPagination(page, limit, totalItems) };
};

export const getPokemonById = async (id) => withSpecies(await requirePokemon(id));

// Statistik koleksi (aggregation)
export const getStats = async () => {
  const [overall] = await Pokemon.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        averageLevel: { $avg: "$level" },
        highestLevel: { $max: "$level" },
        lowestLevel: { $min: "$level" },
      },
    },
  ]);

  const bySpeciesRaw = await Pokemon.aggregate([{ $group: { _id: "$speciesId", count: { $sum: 1 } } }]);
  const [withTrainer, inParty, inBox, strongest] = await Promise.all([
    Pokemon.countDocuments({ trainerId: { $ne: null } }),
    Pokemon.countDocuments({ storage: "party" }),
    Pokemon.countDocuments({ storage: "box" }),
    Pokemon.findOne().sort({ level: -1, _id: 1 }),
  ]);

  const byType = {};
  const bySpecies = bySpeciesRaw
    .map(({ _id, count }) => {
      const species = findSpecies(_id);
      // Pokemon bertipe ganda dihitung di kedua tipenya
      species?.type.forEach((t) => { byType[t] = (byType[t] ?? 0) + count; });
      return { speciesId: _id, speciesName: species?.name, count };
    })
    .sort((a, b) => b.count - a.count || a.speciesId - b.speciesId);

  const total = overall?.total ?? 0;
  return {
    totalPokemon: total,
    averageLevel: total ? Math.round(overall.averageLevel * 10) / 10 : 0,
    highestLevel: overall?.highestLevel ?? 0,
    lowestLevel: overall?.lowestLevel ?? 0,
    ownership: { withTrainer, withoutTrainer: total - withTrainer, inParty, inBox },
    byType,
    bySpecies,
    strongestPokemon: strongest ? withSpecies(strongest) : null,
  };
};

// ---------- UPDATE ----------

// Hanya nickname, level, heldItem yang boleh diubah
export const updatePokemon = async (id, body) => {
  const doc = await requirePokemon(id);

  const { nickname, level, heldItem } = body;
  if (nickname === undefined && level === undefined && heldItem === undefined) {
    throw httpError(400, "Isi minimal salah satu: nickname, level, heldItem");
  }

  if (nickname !== undefined) {
    assertValidNickname(nickname);
    doc.nickname = nickname === "" ? null : nickname;
  }
  if (heldItem !== undefined) doc.heldItem = heldItem;

  if (level !== undefined) {
    assertValidLevel(level);
    const species = findSpecies(doc.speciesId);
    doc.level = level;
    doc.exp = expForLevel(level);
    doc.maxHp = calcMaxHp(species.baseStats.hp, level);
    doc.hp = doc.maxHp;
    doc.stats = calcStats(species, level);
  }

  await doc.save();
  return withSpecies(doc);
};

// Training: tambah EXP, naik level otomatis
export const addExp = async (id, body) => {
  const { exp } = body;
  if (!Number.isInteger(exp) || exp < 1 || exp > 10_000_000) {
    throw httpError(400, "exp harus bilangan bulat 1-10000000");
  }

  const doc = await requirePokemon(id);
  if (doc.level >= MAX_LEVEL) throw httpError(400, "Pokemon sudah mencapai level maksimal");

  const species = findSpecies(doc.speciesId);
  const previousLevel = doc.level;
  const result = applyExp(doc.level, doc.exp, exp);

  doc.exp = result.exp;
  if (result.level !== previousLevel) {
    const newMaxHp = calcMaxHp(species.baseStats.hp, result.level);
    doc.hp = Math.min(newMaxHp, doc.hp + (newMaxHp - doc.maxHp)); // HP bertambah sebesar kenaikan maxHp
    doc.maxHp = newMaxHp;
    doc.level = result.level;
    doc.stats = calcStats(species, result.level);
  }
  await doc.save();

  return {
    pokemon: withSpecies(doc),
    training: {
      expGained: exp,
      previousLevel,
      currentLevel: doc.level,
      levelsGained: doc.level - previousLevel,
      expToNextLevel: doc.level >= MAX_LEVEL ? 0 : expForLevel(doc.level + 1) - doc.exp,
    },
  };
};

// Evolusi berbasis level (data dari evolutions.js)
export const evolvePokemon = async (id) => {
  const doc = await requirePokemon(id);

  const evo = evolutions[doc.speciesId];
  if (!evo) throw httpError(400, "Pokemon ini tidak bisa berevolusi");
  if (doc.level < evo.level) throw httpError(400, `Belum cukup level. Butuh level ${evo.level}`);

  const species = findSpecies(evo.to);
  const newMaxHp = calcMaxHp(species.baseStats.hp, doc.level);
  doc.hp = doc.hp > 0 ? Math.min(newMaxHp, doc.hp + (newMaxHp - doc.maxHp)) : 0;
  doc.speciesId = evo.to;
  doc.maxHp = newMaxHp;
  doc.stats = calcStats(species, doc.level);

  await doc.save();
  return withSpecies(doc);
};

// Pindahkan kepemilikan: body { "trainerId": "<id>" } atau { "trainerId": null } untuk melepas
export const assignTrainer = async (id, body) => {
  const { trainerId } = body;
  if (trainerId === undefined) throw httpError(400, "trainerId wajib diisi (isi null untuk melepas trainer)");

  const doc = await requirePokemon(id);

  if (trainerId === null) {
    doc.trainerId = null;
    doc.storage = null;
  } else {
    await requireTrainer(trainerId);
    if (String(doc.trainerId) !== String(trainerId)) {
      doc.trainerId = trainerId;
      doc.storage = await pickStorage(trainerId);
    }
  }

  await doc.save();
  return withSpecies(doc);
};

// Pindahkan antara party dan box: body { "storage": "party" | "box" }
export const moveStorage = async (id, body) => {
  const { storage } = body;
  if (!["party", "box"].includes(storage)) throw httpError(400, "storage harus party atau box");

  const doc = await requirePokemon(id);
  if (!doc.trainerId) throw httpError(400, "Pokemon ini belum dimiliki trainer");

  if (doc.storage !== storage) {
    if (storage === "party") {
      const partyCount = await Pokemon.countDocuments({ trainerId: doc.trainerId, storage: "party" });
      if (partyCount >= PARTY_LIMIT) throw httpError(400, `Party sudah penuh (maksimal ${PARTY_LIMIT} Pokemon)`);
    }
    doc.storage = storage;
    await doc.save();
  }
  return withSpecies(doc);
};

// ---------- DELETE ----------

export const deletePokemon = async (id) => {
  assertValidId(id);
  const doc = await Pokemon.findByIdAndDelete(id);
  if (!doc) throw httpError(404, "Pokemon tidak ditemukan");
  return withSpecies(doc);
};
