import api from "./api";

export const getMe = async () => {
  const { data } = await api.get("/users/me");
  return data;
};

export const updateMe = async (payload) => {
  const { data } = await api.patch("/users/me", payload);
  return data;
};