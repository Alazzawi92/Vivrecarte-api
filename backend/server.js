import { env } from "./src/config/env.js";
import app from "./src/app.js";

// 1. Configuration des Headers CSP
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline';");
  next();
});

// 2. Ta route de test
app.get("/", (req, res) => {
  res.send('Mon serveur fonctionne bien sur Vercel !!!');
});

// 3. IMPORTANT : Exportation pour Vercel (indispensable en Serverless)
export default app;

// 4. Lancement local uniquement
if (process.env.NODE_ENV !== 'production') {
  const PORT = env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur local sur http://localhost:${PORT}`);
  });
}