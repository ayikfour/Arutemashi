import unsplash from "./controller/unsplash";
import cron from "node-cron";
import mock from "./controller/mock";
import message from "./controller/message";
import CONFIG from "./config/config";

function mocking() {
   let result = mock.sircistic(
      "Privilige itu omong kosong. Bilang aja lu iri sama bilioner"
   );
   console.log(result);
}

const bot = {
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
         await message.get_messages();
         await message.consume_messages();
      });
      return task;
   },
   arute_jpg: function() {
      let task = cron.schedule(CONFIG.scheduler.arute_jpg, async () => {
         await message.tweet_messages();
      });
      return task;
   }
};

export default bot;
