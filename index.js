import CONFIG from "./src/config/config";
import express from "express";
import bot from "./src";
import fetch from "node-fetch";
import logger from "./src/utils/logger";
import db from "./src/helper/database";

global.fetch = fetch;

const app = express();

app.listen(CONFIG.port, () => {
   const log = logger("LISTENING");
   log.success(`Arutemashi is running on port ${CONFIG.port} 🔥`);
});

app.get("/messages", (req, res, next) => {
   const messages = db.messages.get("messages").value();
   res.status(200).json(messages);
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
// bot.arute_message().start();
bot.arute_jpg().start();
