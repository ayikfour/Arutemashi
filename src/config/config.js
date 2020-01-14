require('dotenv').config();

module.exports = {
   port: process.env.PORT || 4040,
   downloads: {
      raw: 'raw',
      full: 'full',
      regular: 'regular',
      small: 'small',
      thumb: 'thumb'
   },
   twitter: {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      id_self: '1171122850549252096',
      id_kamisama: '811526869233201152'
   },
   unsplash: {
      access_key: process.env.UNSPLASH_ACCESS_KEY,
      secret_key: process.env.UNSPLASH_SECRET_KEY
   },
   pinterest: {
      access_token: process.env.PINTERES_ACCESS_TOKEN
   },
   scheduler: {
      delete_photos: process.env.DELETE_PHOTOS || '0 */5 * * *',
      arute_messages: process.env.ARUTE_MESSAGES || '*/2 * * * *',
      arute_jpg: process.env.ARUTE_JPG || '*/1 * * * *',
      arute_harvest: process.env.ARUTE_HARVEST || '*/1 * * * *',
      arute_txt: process.env.ARUTE_TXT || '*/1 * * * *',
      arute_observer: process.env.ARUTE_OBSERVER || '*/2 * * * *',
      arute_train: process.env.ARUTE_TRAIN || '0 */5 * * *'
   },
   error_code: {
      179: 'sir, this is private account 🤷‍♂️',
      187: 'duplicated tweet 😬',
      136: "sis, I'm blocked by this user 😂",
      144: 'tweet has been deleted ☹️',
      186: 'you are writing essay? this is too long 🙄',
      130: "sorry, I'm verry bussy right now 🥴"
   },
   follow_message: [
      "Uh oh sorry, we don't even a friend 🥵",
      'No, thankyou. Maybe follow me first???? 🤷‍♂️',
      'Go away stranger ugghhh 🥴',
      'Lah ga ngefollow nyuruh nyuruh 🙂'
   ],
   selector: {
      arute_jpg: /\B\/polaroid\b|\B\/tumblr\b|\B\/story\b/,
      mock: /\B\/hah\b|\B\/hilih\b|\B\/lapo\b|\B\/emosi\b|\B\/goblok\b/
   },
   trigger: {
      // arute_jpg: /(\/arute.jpg)/g,
      arute_jpg: /\bpolaroid|tumblr|story\b/,
      mock: /\bhah|hilih|lapo|emosi\b/
   }
};
