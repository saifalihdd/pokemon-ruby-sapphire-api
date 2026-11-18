import mongoose from "mongoose";
import Pokemon from "../models/Pokemon.js";
import { pokedex, findSpecies } from "../data/pokedex.js";
import { evolutions } from "../data/evolutions.js";

const MAX_LEVEL = 100;
const NICKNAME_MAX = 12;

// Error dengan status HTTP, supaya controller tinggal membalas
const httpError = (status, message) => Object.assign(new Error(message), { status });

// Rumus dari pokemonFactory.js
const calcStat = (base, level) => Math.floor((2 * base * level) / 100) + 5;
const calcMaxHp = (base, level) => Math.floor((2 * base * level) / 100) + level + 10;
const expForLevel = (level) => level ** 3;

const calcStats = (species, level) => {
  const { atk, def, spAtk, spDef, speed } = species.baseStats;
  return {
    atk: calcStat(atk, level),
    def: calcStat(def, level),
    spAtk: calcStat(spAtk, level),
    spDef: calcStat(spDef, level),
    speed: calcStat(speed, level),
  };
};

const assertValidId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw httpError(400, "Format ID tidak valid");
};

const assertValidLevel = (level) => {
  if (!Number.isInteger(level) || level < 1 || level > MAX_LEVEL) {
    throw httpError(400, `Level harus bilangan bulat 1-${MAX_LEVEL}`);
  }
};

const assertValidNickname = (nickname) => {
  if (nickname === null) return;
  if (typeof nickname !== "string" || nickname.length > NICKNAME_MAX || !/^[A-Za-z0-9 _-]*$/.test(nickname)) {
    throw httpError(400, `Nickname maksimal ${NICKNAME_MAX} karakter (huruf, angka, spasi, _ atau -)`);
  }
};

// Tambahkan info spesies ke dokumen agar response lebih informatif
const withSpecies = (doc) => {
  const species = findSpecies(doc.speciesId);
  return { ...doc.toObject(), speciesName: species?.name, types: species?.type };
};

// CREATE
export const createPokemon = async ({ speciesId, level = 5, nickname = null, heldItem = null }) => {
  const species = findSpecies(speciesId);
  if (!species) throw httpError(400, `Spesies dengan id ${speciesId} tidak ditemukan`);
  assertValidLevel(level);
  assertValidNickname(nickname);

  const maxHp = calcMaxHp(species.baseStats.hp, level);
  const doc = await Pokemon.create({
    speciesId, nickname, level, heldItem,
    exp: expForLevel(level),
    hp: maxHp,
    maxHp,
    stats: calcStats(species, level),
  });
  return withSpecies(doc);
};

// READ (semua) dengan query: search, type, minLevel, maxLevel, sort
export const getAllPokemon = async ({ search, type, minLevel, maxLevel, sort }) => {
  const filter = {};

  if (type) {
    const ids = pokedex.filter((s) => s.type.some((t) => t.toLowerCase() === type.toLowerCase())).map((s) => s.id);
    filter.speciesId = { $in: ids };
  }

  if (search) {
    const keyword = search.toLowerCase();
    const ids = pokedex.filter((s) => s.name.toLowerCase().includes(keyword)).map((s) => s.id);
    filter.$or = [
      { speciesId: { $in: ids } },
      { nickname: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
    ];
  }

  if (minLevel || maxLevel) {
    filter.level = {};
    if (minLevel) filter.level.$gte = Number(minLevel);
    if (maxLevel) filter.level.$lte = Number(maxLevel);
  }

  const sortOptions = { level: { level: 1 }, "-level": { level: -1 }, newest: { createdAt: -1 }, oldest: { createdAt: 1 } };
  const docs = await Pokemon.find(filter).sort(sortOptions[sort] ?? sortOptions.newest);
  return docs.map(withSpecies);
};

// READ (satu)
export const getPokemonById = async (id) => {
  assertValidId(id);
  const doc = await Pokemon.findById(id);
  if (!doc) throw httpError(404, "Pokemon tidak ditemukan");
  return withSpecies(doc);
};

// UPDATE: hanya nickname, level, heldItem yang boleh diubah
export const updatePokemon = async (id, body) => {
  assertValidId(id);
  const doc = await Pokemon.findById(id);
  if (!doc) throw httpError(404, "Pokemon tidak ditemukan");

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

// DELETE
export const deletePokemon = async (id) => {
  assertValidId(id);
  const doc = await Pokemon.findByIdAndDelete(id);
  if (!doc) throw httpError(404, "Pokemon tidak ditemukan");
  return withSpecies(doc);
};

// BONUS: evolusi berbasis level (data dari evolutions.js)
export const evolvePokemon = async (id) => {
  assertValidId(id);
  const doc = await Pokemon.findById(id);
  if (!doc) throw httpError(404, "Pokemon tidak ditemukan");

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