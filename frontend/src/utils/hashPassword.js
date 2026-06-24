export async function hashPassword(plainTextPassword) {
  const encodedPassword = new TextEncoder().encode(plainTextPassword);
  const digestBuffer = await window.crypto.subtle.digest("SHA-256", encodedPassword);
  const digestBytes = Array.from(new Uint8Array(digestBuffer));
  return digestBytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
