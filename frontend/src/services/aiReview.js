import api from "./api";

export async function aiReview(code, language) {
  const { data } = await api.post("/api/reviews/analyze", {
    code,
    language,
  });

  return data.review;
}

export async function aiFixCode(code, language) {
  const { data } = await api.post("/api/reviews/fix", {
    code,
    language,
  });

  return data.code || code;
}