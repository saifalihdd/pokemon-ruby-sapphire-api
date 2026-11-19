export const handleError = (res, error) => {
  const status = error.status || 500;
  const message = status === 500 ? "Terjadi kesalahan pada server" : error.message;
  if (status === 500) console.error(error);
  res.status(status).json({ success: false, message });
};
