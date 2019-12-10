import CONFIG from "./src/config/config";
import express from "express";
import bot from "./src";
import fetch from "node-fetch";
import logger from "./src/utils/logger";

global.fetch = fetch;

const app = express();

app.listen(CONFIG.port, () => {
   const log = logger("LISTENING");
   log.success(`Arutemashi is running on port ${CONFIG.port} 🔥`);
});

app.get("/", (req, res, next) => {
   res.status(200).send({
      express: `Arutemashi is running on port ${CONFIG.port}`
   });
});

// bot.mocking().start();
// bot.collect_photo().start();
// bot.download_photo().start();
// bot.captioning();
bot.stream_message();
