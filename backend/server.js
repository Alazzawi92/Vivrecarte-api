import { env } from "./src/config/env.js";
import app from "./src/app.js";

const PORT = env.PORT;

app.get("/", (req, res) => {
  res.send('Mon serveur fonctionne bien !!! ')
})

app.listen(PORT, () => {
  console.log(`Serveur tourn sur localhost:${PORT}`);
});
