const DEFAULT_ORIGINS = ["http://localhost:5173", "http://localhost:3000"];

function getAllowedOrigins() {
  const originsFromEnv = process.env.CLIENT_ORIGINS;

  if (!originsFromEnv) {
    return DEFAULT_ORIGINS;
  }

  return originsFromEnv
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const allowedOrigins = getAllowedOrigins();

export const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools like Postman, curl, Thunder Client
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};