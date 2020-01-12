import unsplash from './controller/unsplash';
import cron from 'node-cron';
import mock from './controller/mock';
import message from './controller/message';
import CONFIG from './config/config';
import mention from './controller/mention';
import tweet from './controller/tweet';
import arute from './controller/arute';
import train from './controller/train';

function mocking() {
   let result = mock.sircistic(
      'Privilige itu omong kosong. Bilang aja lu iri sama bilioner'
   );
   console.log(result);
}

const bot = {
   arute_boot: async function() {
      await tweet.setup('active 🔥');
   },
   arute_sleep: async function() {
      await tweet.setup('sleep 🌙');
   },
   arute_observe: function() {
      let task = cron.schedule('*/1 * * * *', async () => {
         await mention.fetch();
         await mention.consume();
         await message.fetch();
         await message.consume();
      });
      return task;
   },
   arute_train: function() {
      let task = cron.schedule(CONFIG.scheduler.arute_train, () => {
         train.tags();
      });
      return task;
   },
   arute_txt: function() {
      let task = cron.schedule(CONFIG.scheduler.arute_txt, async () => {
         await arute.txt();
      });
      return task;
   },
   mocking: function() {
      let task = cron.schedule(CONFIG.scheduler.arute_jpg, () => mocking());
      return task;
   },
   arute_harvest: function() {
      let task = cron.schedule(CONFIG.scheduler.arute_harvest, async () => {
         await unsplash.get_photos();
      });
      return task;
   },
   delete_photos: function() {
      let task = cron.schedule(CONFIG.scheduler.delete_photos, async () => {
         await unsplash.delete_photos();
      });
      return task;
   },
   arute_message: function() {
      let task = cron.schedule(CONFIG.scheduler.arute_messages, async () => {
         await message.fetch();
         await message.consume();
      });
      return task;
   },
   arute_jpg: function() {
      let task = cron.schedule(CONFIG.scheduler.arute_jpg, async () => {
         await arute.jpg();
      });
      return task;
   }
};

export default bot;
