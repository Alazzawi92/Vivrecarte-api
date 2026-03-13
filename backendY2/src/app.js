import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import { errorHandle } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";

const app = express();

// --- CRUCIAL POUR VERCEL ---
// On indique à Express qu'il est derrière un proxy (Vercel)
// '1' signifie qu'on fait confiance au premier saut (hop)
app.set("trust proxy", 1); 

// ================== Middlewares de sécurité ================== //
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: env.CLIENT_URL,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// ================== Configuration Rate Limit ================== //
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  // CETTE LIGNE EST LA SOLUTION :
  validate: { 
    trustProxy: false,
    xForwardedForHeader: false,
    forwardedHeader: false 
  }, 
  message: { error: "Trop de requêtes, réessayez plus tard" }
});
// Appliquer le limiteur global
app.use(limiter);

// ================== Routes ================== //
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'VivreCard API is running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes);

app.get("/ip", (req, res) => {
  res.send(req.ip); // Devrait maintenant afficher l'IP réelle de l'utilisateur, pas celle de Vercel
});

app.use(errorHandle);

export default app;