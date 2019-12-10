import CONFIG from "../config/config";
import logger from "../utils/logger";
import Twit from "twit";
import db from "../helper/database";

const twit = new Twit(CONFIG.twitter);
const context = {
   get: "get message",
   consume: "consume message"
};

async function get_messages() {
   const log = logger(context.get);
   log.header();
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
      log.process("updating", `store ${events.length} events in database`);
      update_messages(events);

      //Writing next counter to messages db
      log.process("updating", `next cursor`);
      update_cursor(next_cursor);
   } catch (error) {
      log.error(error.messages);
   } finally {
      log.success("everything's set!");
   }
}

function update_messages(fetched = []) {
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
}

function update_cursor(next_cursor = 0) {
   if (next_cursor == 0) return;
   db.messages
      .get("cursor")
      .assign(next_cursor)
      .write();
}

function is_cursor_exist() {
   const cursor = db.messages.get("cursor").value();
   return cursor != 0;
}

function move_message(message_id = "") {
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
}

async function consume_messages() {
   const log = logger(context.consume);
   log.header();
   try {
      // get new messages array
      let messages = [...db.messages.get("new").value()];

      // if messages length is 0, then nothing to consume
      if (messages.length == 0) throw new Error("nothing to consume :(");

      // get texts from new messages entry
      // then saved it into database
      messages.forEach(event => {
         let id = event.id;
         let text = event.message_create.message_data.text;
         let split = text.split(" ");

         log.process("event", `id: ${id}`).process("event", `text: ${text}`);

         // check wether the string contain right tokens
         if (split[0] == "/arute.jpg/") {
            split.shift();
            text = split.join(" ");

            // save to texts array in database
            db.messages
               .get("texts")
               .push(text)
               .write();
         }

         // movin message from new messages array
         // to the old messages array
         log.process("moving", `moving new messages id ${id} to olds`);
         move_message(id);
      });

      log.success("consuming messages done!");
   } catch (error) {
      log.error(error.message);
   }
}

export default {
   get_messages,
   consume_messages
};
