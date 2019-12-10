import CONFIG from "../config/config";
import logger from "../utils/logger";
import Twit from "twit";
import db from "../helper/database";

const twit = new Twit(CONFIG.twitter);
const context = {
   get: "get message"
};

async function get_message() {
   const log = logger(context.get);
   log.header("fetching direct messages events from twitter api");
   try {
      //creating params based on entry.
      //if entry is equal to max (or 20), param next_cursor is set
      const param = is_entry_maxed()
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
      update_message(events);

      //Writing next counter to messages db
      log.process("updating", `next cursor`);
      update_cursor(next_cursor);
   } catch (error) {
      log.error(error.messages);
   }
}

function update_message(fetched = []) {
   const union = db.messages
      .get("messages")
      .unionBy(fetched, "id")
      .sortBy("created_timestamp")
      .reverse()
      .value();

   db.messages
      .get("messages")
      .assign(union)
      .write();
}

function update_cursor(next_cursor = 0) {
   db.messages
      .get("cursor")
      .assign(next_cursor)
      .write();
}

function is_entry_maxed() {
   const entry_length = db.messages.get("messages").value().length;
   return entry_length >= 20;
}

export default {
   get_message
};
