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
  res.status(200).send(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>VivreCard API</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',sans-serif;background:#0f172a;color:#f1f5f9;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px}
    .logo{font-size:2.5rem;font-weight:700;color:#38bdf8;margin-bottom:8px;letter-spacing:-1px}
    .tagline{color:#94a3b8;margin-bottom:40px;font-size:1rem}
    .badge{display:inline-flex;align-items:center;gap:8px;background:#1e293b;border:1px solid #22c55e;color:#22c55e;padding:6px 16px;border-radius:999px;font-size:0.85rem;margin-bottom:40px}
    .badge span{width:8px;height:8px;background:#22c55e;border-radius:50%;animation:pulse 1.5s infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
    .card{background:#1e293b;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:32px;width:100%;max-width:640px}
    .card h2{color:#38bdf8;font-size:1rem;text-transform:uppercase;letter-spacing:2px;margin-bottom:20px}
    .endpoint{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05)}
    .endpoint:last-child{border-bottom:none}
    .method{font-size:0.75rem;font-weight:700;padding:3px 10px;border-radius:6px;min-width:52px;text-align:center}
    .get{background:#1d4ed8;color:#bfdbfe}
    .post{background:#065f46;color:#a7f3d0}
    .put{background:#92400e;color:#fde68a}
    .path{font-family:monospace;font-size:0.9rem;color:#e2e8f0}
    .desc{margin-left:auto;font-size:0.8rem;color:#64748b}
    .lock{font-size:0.75rem;color:#f59e0b;margin-left:4px}
    footer{margin-top:32px;color:#475569;font-size:0.8rem}
  </style>
</head>
<body>
  <div class="logo">VivreCard</div>
  <p class="tagline">API REST · Node.js / Express</p>
  <div class="badge"><span></span> En ligne</div>

  <div class="card">
    <h2>Endpoints disponibles</h2>

    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/api/health</span>
      <span class="desc">Health check</span>
    </div>
    <div class="endpoint">
      <span class="method post">POST</span>
      <span class="path">/api/auth/register</span>
      <span class="desc">Inscription</span>
    </div>
    <div class="endpoint">
      <span class="method post">POST</span>
      <span class="path">/api/auth/login</span>
      <span class="desc">Connexion</span>
    </div>
    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/api/auth/verify/:token</span>
      <span class="desc">Vérification email</span>
    </div>
    <div class="endpoint">
      <span class="method put">PUT</span>
      <span class="path">/api/users/location</span>
      <span class="desc">Mise à jour localisation <span class="lock">🔒</span></span>
    </div>
    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/api/users/active</span>
      <span class="desc">Utilisateurs actifs <span class="lock">🔒</span></span>
    </div>
  </div>

  <footer>🔒 = authentification requise &nbsp;|&nbsp; VivreCard © ${new Date().getFullYear()}</footer>
</body>
</html>`);
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