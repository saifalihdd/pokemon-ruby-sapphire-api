import { pokedex, findSpecies } from "../data/pokedex.js";
import { evolutions } from "../data/evolutions.js";
import { httpError } from "../utils/httpError.js";
import { parsePagination, buildPagination, getString } from "../utils/query.js";

const sortedPokedex = [...pokedex].sort((a, b) => a.id - b.id);

// Query: type, search, legendary (true/false), page, limit
export const getAllSpecies = (query) => {
  const type = getString(query.type);
  const search = getString(query.search);
  const legendary = getString(query.legendary);
  const { page, limit, skip } = parsePagination(query, { defaultLimit: 20, maxLimit: 100 });

  if (legendary !== undefined && !["true", "false"].includes(legendary)) {
    throw httpError(400, "legendary harus true atau false");
  }

  let list = sortedPokedex;
  if (type) list = list.filter((s) => s.type.some((t) => t.toLowerCase() === type.toLowerCase()));
  if (search) list = list.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  if (legendary !== undefined) list = list.filter((s) => Boolean(s.legendary) === (legendary === "true"));

  const items = list.slice(skip, skip + limit).map(({ id, name, type: types, legendary: isLegendary, starter }) => ({
    id,
    name,
    type: types,
    legendary: Boolean(isLegendary),
    starter: Boolean(starter),
  }));

  return { items, pagination: buildPagination(page, limit, list.length) };
};

export const getSpeciesById = (idParam) => {
  const id = Number(idParam);
  if (!Number.isInteger(id)) throw httpError(400, "ID spesies harus berupa angka");

  const species = findSpecies(id);
  if (!species) throw httpError(404, "Spesies tidak ditemukan");

  const evo = evolutions[id];
  const previous = Object.entries(evolutions).find(([, value]) => value.to === id);

  return {
    ...species,
    evolvesTo: evo ? { id: evo.to, name: findSpecies(evo.to)?.name, level: evo.level } : null,
    evolvesFrom: previous ? { id: Number(previous[0]), name: findSpecies(Number(previous[0]))?.name, level: previous[1].level } : null,
  };
};
