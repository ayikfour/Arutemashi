import tweet from './tweet';
import db from '../helper/database';
import logger from '../utils/logger';
import image from './image';
import CONFIG from '../config/config';
import mock from '../controller/mock';

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
      let { text, user_id, selector } = message;
      selector = selector.replace('/', '');

      log.process('drawing', 'caption on photo');
      const media = await image[`${selector}`](text);

      log.process('uploading', 'media to twitter');
      const media_id = await tweet.upload(media);

      log.process('tweeting', `tweeting: ${text}`);
      const status = `/arute.jpg - ${selector}`;

      const tweet_id = await tweet.write(status, media_id);
   } catch (error) {
      throw error;
   }
}

async function from_mention(message = {}) {
   const log = logger('arute.jpg');
   try {
      let { selector, target_tweet_id, id_str, followed_by } = message;
      selector = selector.replace('/', '');

      await check_follow(followed_by, id_str, message.requester);

      log.process('fetching', 'caption on photo');
      const { text, valid } = await tweet.get_tweet(target_tweet_id);

      if (!valid) {
         await tweet.reply_to(id_str, `@${message.requester} ${text}`);
         log.error('failed to create, there is error code');
         return;
      }

      log.process('drawing', 'caption on photo');
      const media = await image[`${selector}`](text);

      log.process('uploading', 'media to twitter');
      const media_id = await tweet.upload(media);

      log.process('tweeting', `tweeting: ${text}`);
      await tweet.reply_to(id_str, `/arute.jpg - ${selector}`, media_id);
   } catch (error) {
      throw error;
   }
}

async function check_follow(followed_by, id_str, requester) {
   try {
      if (!followed_by) {
         let text =
            CONFIG.follow_message[
               Math.floor(Math.random() * CONFIG.follow_message.length)
            ];
         await tweet.reply_to(id_str, `@${requester} ${text}`);
         db.tweets.move_text(id_str);
         throw new Error(`failed to create, @${requester} didn't follow`);
      }
   } catch (error) {
      throw error;
   }
}

async function txt() {
   const log = logger('arute.txt');
   try {
      if (db.tweets.is_texts_empty()) {
         throw new Error('there is no new texts');
      }
      let text = db.tweets.get_text();
      await check_follow(text.followed_by, text.id_str, text.requester);
      if (hurt_myself(text.target_user_id)) {
         log.process('hurt self', 'this user try to mock me');
         await mock_back(text);
      } else {
         let content = await tweet.get_tweet(text.target_tweet_id);
         let selector = text.selector.replace('/', '');
         log.process('get tweet', content.text.substring(0, 15));
         let status = mock[`${selector}`](content.text, content.screen_name);
         log.process('mocking', status);
         let result = await tweet.reply_to(text.id_str, status);
         log.success(`mocking by ${text.requester} has been sent`);
      }
      db.tweets.move_text(text.id_str);
   } catch (error) {
      log.error(error.message, error.status_code);
   }
}

function hurt_myself(target_user_id = '') {
   if (
      target_user_id === CONFIG.twitter.id_kamisama ||
      target_user_id === CONFIG.twitter.id_self
   ) {
      return true;
   } else {
      return false;
   }
}

async function mock_back(text) {
   const log = logger('mock back');
   try {
      let status = '';

      if (text.target_user_id === CONFIG.twitter.id_kamisama) {
         status = "sorry, you imbecile I won't mock my kamisama 🥵";
      } else if (text.target_user_id === CONFIG.twitter.id_self) {
         status = `WKWKWKW ${text.requester} tolol banget si 🤣`;
      }

      await tweet.reply_to(text.id_str, status);
      log.success(`mocking back this user ${text.requester}`);
   } catch (error) {
      throw error;
   }
}
export default { jpg, txt };
