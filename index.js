import CONFIG from './src/config/config';
import express from 'express';
import bot from './src';
import fetch from 'node-fetch';
import logger from './src/utils/logger';
import db from './src/helper/database';
import routes from './src/routes';

global.fetch = fetch;

const app = express();

bot.arute_boot();

const server = app.listen(CONFIG.port, () => {
   const log = logger('listening');
   log.success(`Arutemashi is running on port ${CONFIG.port} 🔥`);
});

app.use(routes);

app.get('/', (req, res, next) => {
   res.status(200).send({
      express: `Arutemashi is running on port ${CONFIG.port}`
   });
});

process.on('exit', async function() {
   server.close();
   await bot.arute_sleep();
   process.exit();
});

process.on('SIGINT', async function() {
   server.close();
   await bot.arute_sleep();
   process.exit();
});

process.on('SIGTERM', async function() {
   server.close();
   await bot.arute_sleep();
   process.exit();
});

bot.arute_jpg().start();
bot.arute_harvest().start();
bot.arute_observe().start();
