import CONFIG from "../config/config";
import logger from "../utils/logger";
import Twit from "twit";
import db from "../helper/database";
import image from "./image";
import tweet from "./tweet";

const twit = new Twit(CONFIG.twitter);
const context = {
   get: "get message",
   consume: "consume message"
};

async function get_messages() {
   const log = logger(context.get);
   try {
      //creating params based on entry.
      //if entry is equal to max (or 20), param next_cursor is set
      const param = is_cursor_exist()
         ? { cursor: db.messages.get("cursor").value() }
         : {};

      //Fetching direct message events list from Twitter api
      //(direct_messages/events/list) endpoint
      log.process("fetching", "from direct_messages/events/list");
      const {
         data: { events, next_cursor }
      } = await twit.get("direct_messages/events/list", param);

      //Writing next events to messages db
      messages.update(events);

      //Writing next counter to messages db
      messages.update_cursor(next_cursor);

      log.success("getting messages is done");
   } catch (error) {
      log.error(error.messages);
   }
}

async function consume_messages() {
   const log = logger(context.consume);
   try {
      // get new messages array
      let messages_data = messages.get_all();

      // if messages length is 0, then nothing to consume
      if (messages.is_empty()) throw new Error("there is no new messages");

      // get texts from new messages entry
      // then saved it into database
      messages_data.forEach(event => {
         let id = event.id;
         let text = event.message_create.message_data.text;
         let user_id = event.message_create.sender_id;
         let split = text.split(" ");
         log.process("messages", `text: ${text}`);
         // check wether the string contain right tokens
         if (split[0] == "/arute.jpg/") {
            split.shift();
            text = split.join(" ");
            // save to texts array in database
            db.messages
               .get("texts")
               .push({ text, user_id })
               .write();
         }
         // movin message from new messages array
         // to the old messages array
         log.process("move", `moving ${text}`);
         messages.move(id);
      });

      log.success("consuming messages done!");
   } catch (error) {
      log.error(error.message);
   }
}

const messages = {
   move: function(message_id = "") {
      // get message with the same id as the parameters
      const message = db.messages
         .get("new")
         .find({ id: message_id })
         .value();
      // remove the message from new messages array
      db.messages
         .get("new")
         .remove({ id: message_id })
         .write();
      // move it into old messages array
      db.messages
         .get("old")
         .push(message)
         .write();
   },
   update: function(fetched = []) {
      // check if old messages array already have same event/message
      // this process return distinct message from old messages array
      const difference = db.messages
         .get("old")
         .xorBy(fetched, "id")
         .sortBy("created_timestamp")
         .reverse()
         .value();
      // then union it with new messages array
      const union = db.messages
         .get("new")
         .unionBy(difference, "id")
         .sortBy("created_timestamp")
         .reverse()
         .value();
      // finaly, save it in to new messages array in database
      db.messages
         .get("new")
         .assign(union)
         .write();
   },
   get_all: function() {
      const messages = db.messages.get("new").value();
      return [...messages];
   },
   is_empty: function() {
      return db.messages
         .get("new")
         .isEmpty()
         .value();
   },
   is_cursor: function() {
      const cursor = db.messages.get("cursor").value();
      return cursor != 0;
   },
   update_cursor: function(next_cursor = 0) {
      if (next_cursor == 0) return;
      db.messages
         .get("cursor")
         .assign(next_cursor)
         .write();
   }
};

async function arute_jpg() {
   const log = logger("arute.jpg");

   try {
      if (texts.is_empty()) {
         throw new Error("there is nothing to tweet");
      }

      const { text, user_id } = texts.get();

      log.process("drawing", "caption on photo");
      const media = await image.draw(text);

      log.process("uploading", "media to twitter");
      const media_id = await tweet.upload(media);

      log.process("tweeting", `tweeting: ${text}`);
      const tweet_id = await tweet.write("/arute.jpg/", media_id);

      log.process("replying", `tweet to ${tweet_id}`);
      await tweet.reply_to(tweet_id, user_id);

      texts.move();
      log.success("message has been tweeted!");
   } catch (error) {
      log.error(error.message);
   }
}

const texts = {
   move: function() {
      const text = db.messages
         .get("texts")
         .head()
         .value();

      db.messages
         .get("tweeted")
         .push(text)
         .write();

      db.messages
         .get("texts")
         .shift()
         .write();
   },
   get: function() {
      return db.messages
         .get("texts")
         .head()
         .value();
   },
   is_empty: function() {
      return db.messages
         .get("texts")
         .isEmpty()
         .value();
   }
};

export default {
   get_messages,
   consume_messages,
   arute_jpg
};
