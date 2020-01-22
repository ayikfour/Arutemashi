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

         let selector = '';
         let source = 'mention';

         let temp = {
            requester: screen_name,
            source: source,
            target_tweet_id: in_reply_to_status_id_str,
            target_user_id: in_reply_to_user_id_str,
            id_str,
            followed_by
         };

         if (is_jpg(text)) {
            [selector] = text.match(CONFIG.selector.arute_jpg);
            db.messages.add_text({ ...temp, selector: selector });
         } else if (is_mock(text)) {
            [selector] = text.match(CONFIG.selector.mock);
            db.tweets.add_text({ ...temp, selector: selector });
         } else {
            db.tweets.move(id_str);
            return;
         }

         //add processed tweet to the database
         //move processed tweet to old
         db.tweets.move(id_str);
         log.process('consuming', `${text} `);
      });
      log.success(`${new_tweet.length} tweets has been processed`);
   } catch (error) {
      log.error(error);
   }
}

function is_jpg(text = '') {
   try {
      let selector = text.match(CONFIG.selector.arute_jpg);
      if (!selector) {
         return false;
      } else {
         return true;
      }
   } catch (error) {
      throw error;
   }
}

function is_mock(text = '') {
   try {
      let selector = text.match(CONFIG.selector.mock);
      if (!selector) {
         return false;
      } else {
         return true;
      }
   } catch (error) {
      throw error;
   }
}

export default { fetch, consume };
