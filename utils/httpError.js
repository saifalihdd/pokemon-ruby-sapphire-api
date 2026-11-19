// Error yang membawa status HTTP, supaya controller tinggal membalas
export const httpError = (status, message) => Object.assign(new Error(message), { status });
