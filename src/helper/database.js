import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

const adapter_photos = new FileSync("./src/helper/database/photos_db.json");
const photos = low(adapter_photos);

const adapter_messages = new FileSync("./src/helper/database/messages_db.json");
const messages = low(adapter_messages);

const adapter_tweets = new FileSync("./src/helper/database/tweets_db.json");
const tweets = low(adapter_tweets);

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
      new: [],
      old: [],
      texts: [],
      tweeted: [],
      last_index: 0,
      cursor: 0
   })
   .write();

tweets
   .defaults({
      new: [],
      old: [],
      texts: [],
      tweeted: [],
      max_id: 0,
      since_id: 0
   })
   .write();

export default { photos, messages, tweets };
