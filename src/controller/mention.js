import CONFIG from '../config/config';
import Twit from 'twit';
import db from '../helper/database';
import tweet from './tweet';
import Big from 'big-js';
import logger from '../utils/logger';
import stripper from 'clean-text-utils';
import mock from './mock';
const twit = new Twit(CONFIG.twitter);

async function fetch() {
   const log = logger('fetch mentions');
   try {
      //build parameter.
      const params = build_params();

      //fetch mentions from Twitter API
      const mention = await twit.get('statuses/mentions_timeline', params);

      //if mention data less then 0, set max and since id
      if (mention.data.length <= 0) {
         log.success('Back to top, Fetch newest');
         db.tweets.set_since_id(db.tweets.get_max_overall());
         db.tweets.set_max_id(undefined);
         return;
      }

      //build tweet model
      let data = tweet.build.tweets(mention.data);

      //update new tweets in database
      db.tweets.update(data);

      //set highest boundary with the latest tweet
      let highest = Big(data[0].id_str);

      //set the lowest boundary with the earliest fetched tweet
      let lowest = Big(data[data.length - 1].id_str);

      //set max_id with the lowest
      db.tweets.set_max_id(lowest);

      //if max overall is null or les than highest
      //replace with current highest
      if (
         !db.tweets.get_max_overall() ||
         db.tweets.get_max_overall() <= highest
      ) {
         db.tweets.set_max_overall(highest);
      }
      log.success(`Fetched ${data.length} tweets`);
   } catch (error) {
      log.error(error.message);
   }
}

function build_params() {
   //since_id: fetch limit since this tweet id
   let since_id = db.tweets.get_since_id()
      ? Big(db.tweets.get_since_id())
      : undefined;
   //max_id: maximal id to fetch
   let max_id = db.tweets.get_max_id()
      ? Big(db.tweets.get_max_id()).minus(1)
      : undefined;
   //maximal tweets count to fetch
   let count = 20;
   //include entities set to false, to keep minimal fetched data
   let include_entities = true;
   let tweet_mode = 'extended';
   return { count, include_entities, since_id, max_id, tweet_mode };
}

async function consume() {
   const log = logger('consume mentions');
   try {
      //get new tweets from database
      const new_tweet = db.tweets.get_new();
      //check if new tweet is exist
      if (new_tweet.length <= 0) {
         log.success('there is no new tweet to process');
         return;
      }
      log.process('processing', `there is ${new_tweet.length} new tweet`);
      //iterating new tweets to process
      new_tweet.map((current_tweet, index) => {
         //destructuring tweet into single item
         let {
            text,
            screen_name,
            id_str,
            in_reply_to_status_id_str,
            in_reply_to_screen_name,
            in_reply_to_user_id_str,
            followed_by
         } = current_tweet;

         //regex selector to match /sarcastify/ or /sircistify/
         let split = text.split(' ');

         //check if selector match with string.
         //if no return
         if (split[1] != '/arute.jpg') {
            db.tweets.move(id_str);
            return;
         }

         let selector = split[2];
         if (selector != '/polaroid' && selector != '/tumblr') {
            db.tweets.move(id_str);
            return;
         }

         //attachment url. tweet to quotes
         let attachment_url = tweet.build.tweet_url(
            in_reply_to_status_id_str,
            in_reply_to_screen_name
         );

         let source = 'mention';

         //add processed tweet to the database
         db.messages.add_text({
            selector: selector,
            requester: screen_name,
            source: source,
            target_tweet_id: in_reply_to_status_id_str,
            target_user_id: in_reply_to_user_id_str,
            id_str,
            attachment_url,
            followed_by
         });

         //move processed tweet to old
         db.tweets.move(id_str);
         log.process('consuming', `${text} `);
      });
      log.success(`${new_tweet.length} tweets has been processed`);
   } catch (error) {
      log.error(error);
   }
}

async function arute_txt() {
   const log = logger('arute.txt');
   try {
      if (db.tweets.is_texts_empty()) {
         throw new Error('there is no new texts');
      }

      let text = db.tweets.get_text();

      if (hurt_myself(text.target_user_id)) {
         log.process('hurt self', 'this user try to mock me');
         // await mock_back(text);
      } else {
         let content = await tweet.get_tweet(text.target_tweet_id);
         log.process('get tweet', content.text);
         let status = mock[`${text.selector}`](content.text);
         log.process('mocking', status);
         // let result = await Tweet.quote(status, text.attachment_url);
         // await Tweet.reply_to(result, text.requester);
         // log.success(`mocking by ${text.requester} has been sent`);
      }
      db.tweets.move_text(text.source);
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
         status = 'LOL dumb bitch try again later 🤣';
      }

      await tweet.reply_to(text.source, text.requester, status);
      log.success(`mocking back this user ${text.requester}`);
   } catch (error) {
      throw error;
   }
}

export default { fetch, consume, arute_txt };
