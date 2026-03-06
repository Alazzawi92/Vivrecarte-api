import { env } from "./src/config/env.js";
import app from "./src/app.js";

const PORT = env.PORT;

app.get('/', (req, res) => {
  res.send(`

      <em>Click the button</em>
  
  <button>Click Me!</button>
  <br/> <!---this is to create a new line -->

  <p>This is a paragraph text.</p>

  <b>This is a bold text.</b>
    `)
})

app.listen(PORT, () => {
  console.log(`Serveur tourn sur localhost:${PORT}`);
});
