import CONFIG from "../config/config";
import logger from "../utils/logger";
import Twit from "twit";

const twit = new Twit(CONFIG.twitter);

async function get_username(user_id = "") {
   const log = logger("get username");
   try {
      const {
         data: { screen_name }
      } = await twit.get("users/show", { user_id: user_id });

      return screen_name;
   } catch (error) {
      console.log(error);
   }
}

async function get_tweet(tweet_id = 0) {
   try {
      const tweet = await twit.get("statuses/show/", {
         id: tweet_id,
         include_entities: false
      });

      return build.tweet(tweet.data);
   } catch (error) {}
}

async function reply_to(tweet_id, user_id) {
   const log = logger("reply to");
   try {
      const screen_name = await get_username(user_id);

      await twit.post("statuses/update", {
         in_reply_to_status_id: tweet_id,
         status: `@${screen_name}`
      });

      log.process("replied", `tweet to ${tweet_id}`);
   } catch (error) {
      log.error(error.message);
   }
}

async function upload(media = "") {
   const log = logger("upload");
   try {
      const {
         data: { media_id_string }
      } = await twit.post("media/upload", { media_data: media });

      return media_id_string;
   } catch (error) {
      throw error;
   }
}

async function write(status = "", media_id_string = "") {
   try {
      const params = { status: status, media_ids: [media_id_string] };
      const tweeted = await twit.post("statuses/update", params);
      return tweeted.data.id_str;
   } catch (error) {
      throw error;
   }
}

async function quote(status = "", tweet_id = "", screen_name = "") {
   try {
      const attachment_url = build.tweet_url(tweet_id, screen_name);
      const params = { status, attachment_url };
      const quoted = await twit.post("statuses/update", params);
      return quoted.data.id_str;
   } catch (error) {
      throw error;
   }
}

const build = {
   tweet_url: function(tweet_id, screen_name) {
      return `https://twitter.com/${screen_name}/status/${tweet_id}`;
   },
   tweets: function(tweets = []) {
      try {
         const cleaned_tweets = tweets.map(tweet => {
            return this.tweet(tweet);
         });
         return cleaned_tweets;
      } catch (error) {
         throw error;
      }
   },
   tweet: function(tweet = {}) {
      const {
         id,
         text,
         in_reply_to_status_id,
         in_reply_to_user_id,
         in_reply_to_screen_name,
         retweet_count,
         favorite_count,
         user: { screen_name, id: user_id }
      } = tweet;
      return {
         id,
         text,
         in_reply_to_status_id,
         in_reply_to_user_id,
         in_reply_to_screen_name,
         retweet_count,
         favorite_count,
         screen_name,
         user_id
      };
   }
};

export default { reply_to, write, upload, build, get_tweet };
