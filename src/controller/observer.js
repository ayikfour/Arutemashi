import CONFIG from '../config/config';
import Twit from 'twit';
import db from '../helper/database';
import Tweet from './tweet';
import Big from 'big-js';
import logger from '../utils/logger';
import { image } from 'image-downloader';
import mock from './mock';
const twit = new Twit(CONFIG.twitter);

async function mention() {
   const log = logger('mentions');
   try {
      //build parameter.
      const params = build_params();
      //fetch mentions from Twitter API
      const mention = await twit.get('statuses/mentions_timeline', params);
      //if no mentions data retrived, return.
      if (mention.data.length == 0) {
         log.success('Nothing to fetch on mention');
         return;
      }
      //if mention data less then 0, set max and since id
      if (mention.data.length < 0) {
         log.success('Back to top, Fetch newest');
         tweets.set_since_id(tweets.get_max_overall());
         tweets.set_max_id(undefined);
         return;
      }
      //build tweet model
      let data = Tweet.build.tweets(mention.data);
      //update new tweets in database
      tweets.update(data);
      //set highest boundary with the latest tweet
      let highest = Big(data[0].id_str);
      //set the lowest boundary with the earliest fetched tweet
      let lowest = Big(data[data.length - 1].id_str);
      //set max_id with the lowest
      tweets.set_max_id(lowest);
      //if max overall is null or les than highest
      //replace with current highest
      if (!tweets.get_max_overall() || tweets.get_max_overall() <= highest) {
         tweets.set_max_overall(highest);
      }
      log.success(`Fetched ${data.length} tweets`);
   } catch (error) {
      console.log(error);
   }
}

function build_params() {
   //since_id: fetch limit since this tweet id
   let since_id = tweets.get_since_id()
      ? Big(tweets.get_since_id())
      : undefined;
   //max_id: maximal id to fetch
   let max_id = tweets.get_max_id()
      ? Big(tweets.get_max_id()).minus(1)
      : undefined;
   //maximal tweets count to fetch
   let count = 20;
   //include entities set to false, to keep minimal fetched data
   let include_entities = false;
   return { count, include_entities, since_id, max_id };
}

async function process() {
   const log = logger('process');
   try {
      //get new tweets from database
      const new_tweet = tweets.new();
      log.process('processing', `there is ${new_tweet.length} new tweet`);
      //iterating new tweets to process
      new_tweet.map((tweet, index) => {
         //destructuring tweet into single item
         let {
            text,
            screen_name,
            id_str,
            in_reply_to_status_id_str,
            in_reply_to_screen_name,
            in_reply_to_user_id_str
         } = tweet;
         //regex selector to match /sarcastify/ or /sircistify/
         let selector = text.match(CONFIG.selector.arute_txt)[0];
         //check if selector match with string.
         //if no return
         if (!selector) {
            return;
         }
         log.process('tweet', `${text} `);
         //attachment url. tweet to quotes
         let attachment_url = Tweet.build.tweet_url(
            in_reply_to_status_id_str,
            in_reply_to_screen_name
         );
         //add processed tweet to the database
         tweets.add_text({
            selector: selector,
            requester: screen_name,
            source: id_str,
            target_tweet: in_reply_to_status_id_str,
            target_id: in_reply_to_user_id_str,
            attachment_url
         });
         //move processed tweet to old
         tweets.move(id_str);
      });
   } catch (error) {
      console.log(error);
   }
}

async function arute_txt() {
   const log = logger('arute.txt');
   try {
      if (
         db.tweets
            .get('texts')
            .isEmpty()
            .value()
      ) {
         throw error('there is no new texts');
      }

      let text = tweets.get_text();
   } catch (error) {}
}

const tweets = {
   get_max_overall: function() {
      return db.tweets.get('max_id_overall').value();
   },
   set_max_overall: function(id) {
      db.tweets.update('max_id_overall', max_overall => id).write();
   },
   get_max_id: function() {
      return db.tweets.get('max_id').value();
   },
   set_max_id: function(id) {
      db.tweets.update('max_id', max_id => id).write();
   },
   get_since_id: function() {
      return db.tweets.get('since_id').value();
   },
   set_since_id: function() {
      return db.tweets.update('since_id', since => id).write();
   },
   update: function(fetched = []) {
      const old = db.tweets.get('old').value();

      const new_tweets = fetched.filter(tweet => {
         let is_exist = db.tweets
            .get('old')
            .find({ id_str: tweet.id_str })
            .value();
         return !is_exist;
      });

      db.tweets
         .get('new')
         .assign(new_tweets)
         .write();
   },
   old: function() {
      const old_tweets = db.tweets.get('old').value();
      return [...old_tweets];
   },
   new: function() {
      const new_tweets = db.tweets.get('new').value();
      return [...new_tweets];
   },
   move: function(id_str) {
      let tweet = db.tweets
         .get('new')
         .find({ id_str: id_str })
         .value();

      db.tweets
         .get('old')
         .push(tweet)
         .write();

      db.tweets
         .get('new')
         .remove({ id_str: id_str })
         .write();
   },
   add_text: function(data = {}) {
      db.tweets
         .get('texts')
         .push(data)
         .write();
   },
   get_text: function() {
      return db.tweets
         .get('texts')
         .tail()
         .value();
   }
};

export default { mention, process };
