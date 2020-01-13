import CONFIG from '../config/config';
import logger from '../utils/logger';
import Twit from 'twit';
import db from '../helper/database';
import image from './image';
import tweet from './tweet';
import stripper from 'clean-text-utils';

const twit = new Twit(CONFIG.twitter);
const context = {
   get: 'fetch messages',
   consume: 'consume messages',
   arutejpg: 'arute.jpg'
};

async function fetch() {
   const log = logger(context.get);
   try {
      //creating params based on entry.
      //if entry is equal to max (or 20), param next_cursor is set
      const param = db.messages.is_cursor_exists()
         ? { cursor: db.messages.get_cursor() }
         : {};

      //Fetching direct message events list from Twitter api
      //(direct_messages/events/list) endpoint
      log.process('fetching', 'fetch messages from DM');
      const {
         data: { events, next_cursor }
      } = await twit.get('direct_messages/events/list', param);

      if (next_cursor) log.process('fetching', 'found next cursor');

      //Writing next events to messages db
      db.messages.set_new(events);

      //Writing next counter to messages db
      // db.messages.set_cursor(next_cursor);

      log.success('getting messages is done');
   } catch (error) {
      log.error(error.messages);
   }
}

async function consume() {
   const log = logger(context.consume);
   try {
      // get new messages array
      let messages_data = db.messages.get_new();

      // if messages length is 0, then nothing to consume
      if (db.messages.is_messages_empty()) {
         log.success('there is no new messages');
         return;
      }

      // get texts from new messages entry
      // then saved it into database
      messages_data.forEach(event => {
         let id = event.id;
         let text = event.message_create.message_data.text;
         let user_id = event.message_create.sender_id;
         let selector = text.match(CONFIG.selector.arute_jpg);

         // check wether the string contain right tokens
         if (selector) {
            let source = 'message';

            text = text.replace(CONFIG.selector.arute_jpg);
            text = stripper.strip.emoji(text);
            text = stripper.strip.extraSpace(text);
            text = stripper.replace.smartChars(text);

            // save to texts array in database
            db.messages.add_text({
               text,
               user_id,
               selector: selector[0],
               source
            });
         }

         // movin message from new messages array
         // to the old messages array
         db.messages.move_message(id);
      });

      log.success('consuming messages done!');
   } catch (error) {
      log.error(error.message);
   }
}

export default {
   fetch,
   consume
};
