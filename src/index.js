import unsplash from "./controller/unsplash";
import cron from "node-cron";
import mock from "./controller/mock";
import image from "./controller/image";
import message from "./controller/message";
import CONFIG from "./config/config";

function mocking() {
   let result = mock.sircistic(
      "Privilige itu omong kosong. Bilang aja lu iri sama bilioner"
   );
   console.log(result);
}

async function collecting() {
   await unsplash.get_photos();
}

async function downloading() {
   await unsplash.download_photo(CONFIG.downloads.regular);
}

const bot = {
   mocking: function() {
      let task = cron.schedule("*/10 * * * * *", () => mocking());
      return task;
   },
   collect_photo: function() {
      let task = cron.schedule("*/1 * * * *", () => collecting());
      return task;
   },
   download_photo: function() {
      let task = cron.schedule("*/15 * * * * *", () => downloading());
      return task;
   },
   captioning: function() {
      image.draw(
         "yes, hello? what is the password? i love you for 10000 years"
      );
   },
   stream_message: function() {
      let task = cron.schedule("*/2 * * * *", async () => {
         await message.get_messages();
      });
      return task;
   },
   consume_message: function() {
      let task = cron.schedule("*/1 * * * *", async () => {
         await message.consume_messages();
      });
      return task;
   }
};

export default bot;
