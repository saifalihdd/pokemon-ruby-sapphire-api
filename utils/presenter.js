import { findSpecies } from "../data/pokedex.js";

// Tambahkan info spesies ke dokumen agar response lebih informatif
export const withSpecies = (doc) => {
  const species = findSpecies(doc.speciesId);
  return { ...doc.toObject(), speciesName: species?.name, types: species?.type };
};
