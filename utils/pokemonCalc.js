import { MAX_LEVEL } from "../config/constants.js";

// Rumus dari pokemonFactory.js (mini project)
export const calcStat = (base, level) => Math.floor((2 * base * level) / 100) + 5;
export const calcMaxHp = (base, level) => Math.floor((2 * base * level) / 100) + level + 10;
export const expForLevel = (level) => level ** 3;

export const calcStats = (species, level) => {
  const { atk, def, spAtk, spDef, speed } = species.baseStats;
  return {
    atk: calcStat(atk, level),
    def: calcStat(def, level),
    spAtk: calcStat(spAtk, level),
    spDef: calcStat(spDef, level),
    speed: calcStat(speed, level),
  };
};

// Tambah EXP, naik level selama EXP mencukupi (maksimal MAX_LEVEL)
export const applyExp = (level, exp, gained) => {
  let newExp = exp + gained;
  let newLevel = level;
  while (newLevel < MAX_LEVEL && newExp >= expForLevel(newLevel + 1)) newLevel++;
  if (newLevel === MAX_LEVEL) newExp = Math.min(newExp, expForLevel(MAX_LEVEL));
  return { level: newLevel, exp: newExp };
};
