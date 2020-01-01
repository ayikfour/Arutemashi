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
    arute_harvest: process.env.ARUTE_HARVEST || '*/1 * * * *'
  },
  selector: {
    arute_jpg: '/arute.jpg/',
    sarcastify: /\w*(\/sarcasitfy\/)/g,
    sircistify: /\w*(\/sircistify\/)/g,
    arute_txt: /(\/sircistify\/|\/sarcastify\/)/
  }
};
