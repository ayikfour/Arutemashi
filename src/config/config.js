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
         process.env.TWITTER_CONSUMER_KEY || "0merVoVwnNLJ8Wq3mAwYLDudi",
      consumer_secret:
         process.env.TWITTER_CONSUMER_SECRET ||
         "9WKEHaEoGaMKEHCluNXG5BO8GhAlbgvAzuDI6lGArYA4OuORsL",
      access_token:
         process.env.TWITTER_ACCESS_TOKEN ||
         "1171122850549252096-IQcgpX5nEm2DLTXtHgsshEBCTJYREO",
      access_token_secret:
         process.env.TWITTER_ACCESS_TOKEN_SECRET ||
         "GXvjW6U62BOcm54PxWfZffKoMvmTBQrUfGWpDnX0Dq6vw",
      id_self: "1171122850549252096",
      id_kamisama: "811526869233201152"
   },
   unsplash: {
      access_key:
         process.env.UNSPLASH_ACCESS_KEY ||
         "1a0ad8ac380e847b80bc381c82c6c07261e26f1375187465e099397a083167f6",
      secret_key:
         process.env.UNSPLASH_SECRET_KEY ||
         "b007ef851362aed886f5304ce0afd6088ba8c834b5e6e94c77a7d4d515581280"
   },
   pinterest: {
      access_token:
         process.env.PINTERES_ACCESS_TOKEN ||
         "Aor5ZvebrQAiTSCg_AcW7rDbhZqHFd-cTtiVpE1GJEsFIgCxTQNZADAAANjHRmDO_hSgv0IAAAAA"
   },
   tumblr: {
      consumer_key:
         process.env.TUMBLR_CONSUMER_KEY ||
         "EzdMIbOg33ANNvG85sWwWD2T9lgRQh4tjJavAl1xDK0363Ku0b",
      consumer_secret:
         process.env.TUMBLR_CONSUMER_SECRET ||
         "n6JoOsO6pqg0simtsIUbL66bz46okUiooZalTmHTESBUrfg8s9",
      token:
         process.env.TUMBLR_TOKEN ||
         "0gG7DPWlY0lpmCnNyhPS6GnHWeyfjXFU6TqkVbCxvRqxw5hKuf",
      token_secret:
         process.env.TUMBLR_TOKEN_SECRET ||
         "NcjBcSFEnKumrLvqSWAHODkxst2SbTwwU1jChYRrG8PXD7Q47C",
      api_key:
         process.env.TUMBLR_API_KEY ||
         "EzdMIbOg33ANNvG85sWwWD2T9lgRQh4tjJavAl1xDK0363Ku0b"
   },
   scheduler: {
      delete_photos: process.env.DELETE_PHOTOS || "0 */5 * * *",
      arute_messages: process.env.ARUTE_MESSAGES || "*/2 * * * *",
      arute_jpg: process.env.ARUTE_JPG || "*/1 * * * *",
      arute_harvest: process.env.ARUTE_HARVEST || "*/1 * * * *"
   },
   selector: {
      arute_jpg: "/arute.jpg/",
      sarcastify: "/sarcastify/",
      sircistify: "/sircistify"
   }
};
