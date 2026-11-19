import { httpError } from "./httpError.js";

// Ambil query param sebagai string (abaikan jika tidak ada / dikirim berulang)
export const getString = (value) => (typeof value === "string" && value.trim() !== "" ? value.trim() : undefined);

export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Pagination: ?page=1&limit=10
export const parsePagination = (query, { defaultLimit = 10, maxLimit = 50 } = {}) => {
  const page = query.page === undefined ? 1 : Number(query.page);
  const limit = query.limit === undefined ? defaultLimit : Number(query.limit);
  if (!Number.isInteger(page) || page < 1) throw httpError(400, "page harus bilangan bulat >= 1");
  if (!Number.isInteger(limit) || limit < 1 || limit > maxLimit) {
    throw httpError(400, `limit harus bilangan bulat 1-${maxLimit}`);
  }
  return { page, limit, skip: (page - 1) * limit };
};

export const buildPagination = (page, limit, totalItems) => ({
  page,
  limit,
  totalItems,
  totalPages: Math.ceil(totalItems / limit),
});
