import unsplash from "./controller/unsplash";
import cron from "node-cron";
import mock from "./controller/mock";
import message from "./controller/message";
import CONFIG from "./config/config";
import observer from "./controller/observer";
import tweet from "./controller/tweet";

function mocking() {
   let result = mock.sircistic(
      "Privilige itu omong kosong. Bilang aja lu iri sama bilioner"
   );
   console.log(result);
}

const bot = {
   arute_observe: function() {
      let task = cron.schedule("*/1 * * * *", async () => {
         await observer.user("paswotnya");
         await observer.process();
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
         await message.get_messages();
         await message.consume_messages();
      });
      return task;
   },
   arute_jpg: function() {
      let task = cron.schedule(CONFIG.scheduler.arute_jpg, async () => {
         await message.arute_jpg();
      });
      return task;
   }
};

export default bot;
