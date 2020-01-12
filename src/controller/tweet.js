import CONFIG from '../config/config';
import logger from '../utils/logger';
import Twit from 'twit';
import striper from 'clean-text-utils';

const twit = new Twit(CONFIG.twitter);

async function get_username(user_id = '') {
   const log = logger('get username');
   try {
      const {
         data: { screen_name }
      } = await twit.get('users/show', { user_id: user_id });

      return screen_name;
   } catch (error) {
      console.log(error);
   }
}

async function get_tweet(tweet_id = 0) {
   try {
      const { resp, data } = await twit.get('statuses/show', {
         id: tweet_id,
         include_entities: true,
         tweet_mode: 'extended'
      });

      let tweet = build.tweet(data);
      let valid = validate(resp.statusCode, tweet.text);
      tweet.text = valid.text;
      return { ...tweet, valid: valid.status };
   } catch (error) {
      throw error;
   }
}

function validate(code, text) {
   try {
      // check if text is empty
      text = text === '' ? 'shit sherlock. that tweet is empty ☹️' : text;

      // if success status code 200
      if (code == 200) return { status: true, text };

      // check if error code exist in config error code list
      const is_in_error_code = Object.keys(CONFIG.error_code).includes(code);

      // get the error message
      if (is_in_error_code) {
         return { status: false, text: CONFIG.error_code[`${code}`] };
      } else {
         return {
            status: false,
            text: 'this is weird, and unusual. please try again 😬'
         };
      }
   } catch (error) {
      throw error;
   }
}

async function reply_to(tweet_id = '', status = '', media_id_string = '') {
   const log = logger('reply to');
   try {
      await twit.post('statuses/update', {
         in_reply_to_status_id: tweet_id,
         status: status,
         media_ids: [media_id_string],
         auto_populate_reply_metadata: true
      });
   } catch (error) {
      log.error(error.message);
   }
}

async function upload(media = '') {
   const log = logger('upload');
   try {
      const {
         data: { media_id_string }
      } = await twit.post('media/upload', { media_data: media });

      return media_id_string;
   } catch (error) {
      throw error;
   }
}

async function setup(status = '') {
   const log = logger('setting up');
   try {
      const params = {
         description: `
status: ${status}
mundane things.
––––
dm & mention trigger: /arute.jpg
follow first to use.
         `
      };
      const { data } = await twit.post('account/update_profile', params);
      log.success(`setup successfully ${status}`);
   } catch (error) {
      log.error(error.message);
   }
}

async function write(status = '', media_id_string = '') {
   try {
      const params = { status: status, media_ids: [media_id_string] };
      const tweeted = await twit.post('statuses/update', params);
      return tweeted.data.id_str;
   } catch (error) {
      throw error;
   }
}

async function quote(status = '', attachment_url = '') {
   try {
      const params = { status, attachment_url };
      const quoted = await twit.post('statuses/update', params);
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
      try {
         const {
            id,
            id_str,
            full_text,
            in_reply_to_status_id_str,
            in_reply_to_user_id_str,
            in_reply_to_screen_name,
            retweet_count,
            favorite_count,
            user: { screen_name, id: user_id, followed_by }
         } = tweet;

         let text = full_text.replace(
            /(https?|chrome):\/\/[^\s$.?#].[^\s]*/gm,
            ''
         );

         return {
            id,
            id_str,
            text,
            in_reply_to_status_id_str,
            in_reply_to_user_id_str,
            in_reply_to_screen_name,
            retweet_count,
            favorite_count,
            screen_name,
            user_id,
            followed_by
         };
      } catch (error) {
         throw error;
      }
   }
};

export default {
   reply_to,
   write,
   upload,
   build,
   get_tweet,
   quote,
   setup,
   get_username
};
