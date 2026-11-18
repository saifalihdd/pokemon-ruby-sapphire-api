import mongoose from "mongoose";

const pokemonSchema = new mongoose.Schema(
  {
    speciesId: { type: Number, required: true },
    nickname: { type: String, default: null, maxlength: 12 },
    level: { type: Number, required: true, min: 1, max: 100, default: 5 },
    exp: { type: Number, required: true },
    hp: { type: Number, required: true },
    maxHp: { type: Number, required: true },
    stats: {
      atk: Number,
      def: Number,
      spAtk: Number,
      spDef: Number,
      speed: Number,
    },
    heldItem: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Pokemon", pokemonSchema);