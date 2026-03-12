import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { errorHandle } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

// ================== Middlewares de sécurité ================== //
// Helmet protège contre XSS, clickjacking et autres vulnérabilités
app.use(helmet({
  contentSecurityPolicy: false // activer CSP en production
}));

// CORS - limiter l'accès aux domaines légitimes
app.use(cors({
  origin: env.CLIENT_URL, // exemple pour production
  optionsSuccessStatus: 200
}));

// Parsing JSON
app.use(express.json());
app.set('trust proxy', 1);
// Limiter le nombre de requêtes global
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,                   // max 50 requêtes par IP
  message: { error: "Trop de requêtes, réessayez plus tard" }
}));

// Limiter les tentatives sur les routes d'auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Trop de tentatives, réessayez plus tard" }
});

// ================== Routes ================== //
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', authLimiter, userRoutes);

// Middleware global de gestion des erreurs
app.use(errorHandle);

export default app;