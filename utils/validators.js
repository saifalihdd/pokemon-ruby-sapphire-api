import mongoose from "mongoose";
import { MAX_LEVEL, NICKNAME_MAX } from "../config/constants.js";
import { httpError } from "./httpError.js";

export const assertValidId = (id, label = "ID") => {
  if (!mongoose.isValidObjectId(id)) throw httpError(400, `Format ${label} tidak valid`);
};

export const assertValidLevel = (level) => {
  if (!Number.isInteger(level) || level < 1 || level > MAX_LEVEL) {
    throw httpError(400, `Level harus bilangan bulat 1-${MAX_LEVEL}`);
  }
};

export const assertValidNickname = (nickname) => {
  if (nickname === null) return;
  if (typeof nickname !== "string" || nickname.length > NICKNAME_MAX || !/^[A-Za-z0-9 _-]*$/.test(nickname)) {
    throw httpError(400, `Nickname maksimal ${NICKNAME_MAX} karakter (huruf, angka, spasi, _ atau -)`);
  }
};
