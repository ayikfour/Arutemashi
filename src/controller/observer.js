import CONFIG from "../config/config";
import Twit from "twit";
import db from "../helper/database";
import Tweet from "./tweet";
import Big from "big-js";
import logger from "../utils/logger";

const twit = new Twit(CONFIG.twitter);

async function mention() {
   try {
      const params = build_params();
      const mention = await twit.get("statuses/mentions_timeline");
      console.log(mention.data.event);
   } catch (error) {
      console.log(error);
   }
}
async function user() {
   const log = logger("timeline");
   try {
      const params = build_params();
      const timeline = await twit.get("statuses/user_timeline", params);

      if (timeline.data.length == 0) {
         log.process("Nothing to fetch on timeline");
         return;
      }

      if (timeline.data.length < 0) {
         log.process("Back to top, Fetch newest");
         tweets.set_since_id(tweets.get_max_overall());
         tweets.set_max_id(undefined);
         return;
      }

      let data = Tweet.build.tweets(timeline.data);
      tweets.update(data);

      log.success(`Fetched ${data.length} tweets`);

      let highest = Big(data.shift().id_str);
      let lowest = Big(data.pop().id_str);

      tweets.set_max_id(lowest);

      if (!tweets.get_max_overall() || tweets.get_max_overall() <= highest) {
         tweets.set_max_overall(highest);
      }
   } catch (error) {
      console.log(error.message);
   }
}

function build_params() {
   let since_id = tweets.get_since_id()
      ? Big(tweets.get_since_id())
      : undefined;
   let max_id = tweets.get_max_id() ? Big(tweets.get_max_id()) - 1 : undefined;
   let count = 20;
   let include_entities = false;
   let screen_name = "paswotnya";
   return { count, include_entities, screen_name, since_id, max_id };
}

async function process() {
   const log = logger("process");

   try {
      const new_tweet = tweets.new();
      log.process("new tweet", `there is ${new_tweet.length} new tweet`);

      new_tweet.map((tweet, index) => {
         let {
            in_reply_to_status_id_str,
            text,
            screen_name,
            id_str,
            in_reply_to_screen_name,
            in_reply_to_user_id_str
         } = tweet;

         let selector = text.split(" ")[0];
         log.process("tweet", `index ${index} - ${text} `);

         if (
            selector == CONFIG.selector.sarcastify ||
            selector == CONFIG.selector.sircistify
         ) {
            let attachment_url = Tweet.build.tweet_url(
               in_reply_to_status_id_str,
               in_reply_to_screen_name
            );
            this.add_text({
               selector: selector,
               requester: screen_name,
               source: id_str,
               target_tweet: in_reply_to_status_id_str,
               target_id: in_reply_to_user_id_str,
               attachment_url
            });
         }
         tweets.move(id_str);
      });
   } catch (error) {
      console.log(error);
   }
}

const tweets = {
   get_max_overall: function() {
      return db.tweets.get("max_id_overall").value();
   },
   set_max_overall: function(id) {
      db.tweets.update("max_id_overall", max_overall => id).write();
   },
   get_max_id: function() {
      return db.tweets.get("max_id").value();
   },
   set_max_id: function(id) {
      db.tweets.update("max_id", max_id => id).write();
   },
   get_since_id: function() {
      return db.tweets.get("since_id").value();
   },
   set_since_id: function() {
      return db.tweets.update("since_id", since => id).write();
   },
   update: function(fetched = []) {
      const difference = db.tweets
         .get("old")
         .xorBy(fetched, "id")
         .value();

      const union = db.tweets
         .get("new")
         .unionBy(difference, "id")
         .value();

      db.tweets
         .get("new")
         .assign(union)
         .write();
   },
   old: function() {
      const old_tweets = db.tweets.get("old").value();
      return [...old_tweets];
   },
   new: function() {
      const new_tweets = db.tweets.get("new").value();
      return [...new_tweets];
   },
   move: function(id_str) {
      let tweet = db.tweets
         .get("new")
         .find({ id_str: id_str })
         .value();

      db.tweets
         .get("old")
         .push(tweet)
         .write();

      db.tweets
         .get("new")
         .remove({ id_str: id_str })
         .write();
   },
   add_text: function(data = {}) {
      db.tweets
         .get("texts")
         .push(data)
         .write();
   }
};

export default { mention, user, process };
