import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 20 },
    hometown: { type: String, default: null, trim: true, maxlength: 30 },
    badges: { type: Number, default: 0, min: 0, max: 8 },
  },
  { timestamps: true }
);

export default mongoose.model("Trainer", trainerSchema);
