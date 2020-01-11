import tweet from './tweet';
import db from '../helper/database';
import logger from '../utils/logger';
import image from './image';
import CONFIG from '../config/config';

async function jpg() {
   const log = logger('arute.jpg');

   try {
      if (db.messages.is_texts_empty()) {
         log.success('there is nothing to tweet');
         return;
      }

      const message = db.messages.get_text();

      if (message.source == 'message') {
         await from_message(message);
      } else {
         await from_mention(message);
      }

      db.messages.move_text();
      log.success('message has been tweeted!');
   } catch (error) {
      log.error(error.message);
   }
}

async function from_message(message = {}) {
   const log = logger('arute.jpg');

   try {
      const { text, user_id, selector } = message;

      log.process('fetching', 'fetch username based on id');
      const username = await tweet.get_username(user_id);

      log.process('drawing', 'caption on photo');
      const media = await image.get(selector, text);

      log.process('uploading', 'media to twitter');
      const media_id = await tweet.upload(media);

      log.process('tweeting', `tweeting: ${text}`);
      const status = `/arute.jpg - ${username}`;

      const tweet_id = await tweet.write(status, media_id);
   } catch (error) {
      throw error;
   }
}

async function from_mention(message = {}) {
   const log = logger('arute.jpg');
   try {
      const { selector, target_tweet_id, id_str, followed_by } = message;

      if (!followed_by) {
         let text =
            CONFIG.follow_message[
               Math.floor(Math.random() * CONFIG.follow_message.length)
            ];

         await tweet.reply_to(id_str, `@${message.requester} ${text}`);
         log.error(`failed to create, @${message.requester} didn't follow`);
         return;
      }

      log.process('fetching', 'caption on photo');
      const { text, valid } = await tweet.get_tweet(target_tweet_id);

      if (!valid) {
         await tweet.reply_to(id_str, `@${message.requester} ${text}`);
         log.error('failed to create, there is error code');
         return;
      }

      log.process('drawing', 'caption on photo');
      let media = await image.get(selector, text);

      log.process('uploading', 'media to twitter');
      const media_id = await tweet.upload(media);

      log.process('tweeting', `tweeting: ${text}`);
      await tweet.reply_to(
         id_str,
         `@${message.requester} /arute.jpg`,
         media_id
      );
   } catch (error) {
      throw error;
   }
}
export default { jpg };
