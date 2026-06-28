import api from "./api";

async function getJson(path, fallback) {
  try {
    const { data } = await api.get(path);
    return data;
  } catch {
    return fallback;
  }
}

export const getFeatures = (fallback) => getJson("/api/features", fallback);
export const getDashboard = (fallback) => getJson("/api/dashboard", fallback);
export const getLanguages = (fallback) => getJson("/api/languages", fallback);
export const getHistory = (fallback) => getJson("/api/history", fallback);