import api from "./api";

export async function loginRequest(email, password) {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  return data;
}

export async function registerRequest({ username, email, password, role = "user" }) {
  const { data } = await api.post("/auth/register", {
    username,
    email,
    password,
    role,
  });

  return data;
}