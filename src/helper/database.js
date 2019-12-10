import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const adapter_photos = new FileSync("./src/helper/database/photos_db.json");
const photos = low(adapter_photos);

const adapter_messages = new FileSync("./src/helper/database/messages_db.json");
const messages = low(adapter_messages);

photos
   .defaults({
      photos: [],
      tags: [],
      keywords: "moody",
      page: 1,
      total_page: 1,
      total_photo: 1,
      count: 0
   })
   .write();

messages
   .defaults({
      messages: [],
      tweeted: [],
      cursor: 0
   })
   .write();

export default { photos, messages };
