require("dotenv").config();

module.exports = {
   port: process.env.PORT || 4040,
   downloads: {
      raw: "raw",
      full: "full",
      regular: "regular",
      small: "small",
      thumb: "thumb"
   },
   twitter: {
      consumer_key:
         process.env.TWITTER_CONSUMER_KEY || "TWITTER_CONSUMER_KEY",
      consumer_secret:
         process.env.TWITTER_CONSUMER_SECRET ||
         "TWITTER_CONSUMER_SECRET",
      access_token:
         process.env.TWITTER_ACCESS_TOKEN ||
         "TWITTER_ACCESS_TOKEN",
      access_token_secret:
         process.env.TWITTER_ACCESS_TOKEN_SECRET ||
         "TWITTER_ACCESS_TOKEN_SECRET"
   },
   unsplash: {
      access_key:
         process.env.UNSPLASH_ACCESS_KEY ||
         "UNSPLASH_ACCESS_KEY",
      secret_key:
         process.env.UNSPLASH_SECRET_KEY ||
         "UNSPLASH_SECRET_KEY"
   },
   tumblr: {
      consumer_key:
         process.env.TUMBLR_CONSUMER_KEY ||
         "TUMBLR_CONSUMER_KEY",
      consumer_secret:
         process.env.TUMBLR_CONSUMER_SECRET ||
         "TUMBLR_CONSUMER_SECRET",
      token:
         process.env.TUMBLR_TOKEN ||
         "TUMBLR_TOKEN",
      token_secret:
         process.env.TUMBLR_TOKEN_SECRET ||
         "TUMBLR_TOKEN_SECRET",
      api_key:
         process.env.TUMBLR_API_KEY ||
         "TUMBLR_API_KEY"
   },
   scheduler: {
      delete_photos: process.env.DELETE_PHOTOS || "0 */5 * * *",
      arute_messages: process.env.ARUTE_MESSAGES || "*/2 * * * *",
      arute_jpg: process.env.ARUTE_JPG || "*/1 * * * *",
      arute_harvest: process.env.ARUTE_HARVEST || "*/1 * * * *"
   }
};
