import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter_photos = new FileSync('./src/helper/database/photos_db.json');
const photos_db = low(adapter_photos);

const adapter_messages = new FileSync('./src/helper/database/messages_db.json');
const messages_db = low(adapter_messages);

const adapter_tweets = new FileSync('./src/helper/database/tweets_db.json');
const tweets_db = low(adapter_tweets);

photos_db
   .defaults({
      photos: [],
      tags: [],
      keywords: 'mood',
      page: 1,
      total_page: 1,
      total_photo: 1,
      count: 0
   })
   .write();

messages_db
   .defaults({
      new: [],
      old: [],
      texts: [],
      tweeted: [],
      last_index: 0,
      cursor: 0
   })
   .write();

tweets_db
   .defaults({
      new: [],
      old: [],
      texts: [],
      tweeted: [],
      max_id: undefined,
      since_id: undefined,
      max_id_overall: undefined
   })
   .write();

const messages = {
   root: messages_db,
   move_message: function(message_id = '') {
      // get message with the same id as the parameters
      const message = messages_db
         .get('new')
         .find({ id: message_id })
         .value();
      // remove the message from new messages array
      messages_db
         .get('new')
         .remove({ id: message_id })
         .write();
      // move it into old messages array
      messages_db
         .get('old')
         .push(message)
         .write();
   },
   set_new: function(fetched = []) {
      // check if old messages array already have same event/message
      const news = fetched.filter(message => {
         let is_exist = messages_db
            .get('old')
            .find({ id: message.id })
            .value();
         return !is_exist;
      });

      messages_db
         .get('new')
         .push(...news)
         .write();
   },
   get_new: function() {
      const messages = messages_db.get('new').value();
      return [...messages];
   },
   is_messages_empty: function() {
      return messages_db
         .get('new')
         .isEmpty()
         .value();
   },
   is_cursor_exists: function() {
      const cursor = messages_db.get('cursor').value();
      return cursor != 0;
   },
   get_cursor: function() {
      messages_db.get('cursor').value();
   },
   set_cursor: function(next_cursor = 0) {
      if (next_cursor == 0) return;
      messages_db.update('cursor', cursor => next_cursor).write();
   },
   add_text: function(text = {}) {
      messages_db
         .get('texts')
         .push(text)
         .write();
   },
   move_text: function() {
      const text = messages_db
         .get('texts')
         .head()
         .value();

      messages_db
         .get('tweeted')
         .push(text)
         .write();

      messages_db
         .get('texts')
         .shift()
         .write();
   },
   get_text: function() {
      return messages_db
         .get('texts')
         .head()
         .value();
   },
   is_texts_empty: function() {
      return messages_db
         .get('texts')
         .isEmpty()
         .value();
   }
};

const tweets = {
   root: tweets_db,
   get_max_overall: function() {
      return tweets_db.get('max_id_overall').value();
   },
   set_max_overall: function(id) {
      tweets_db.update('max_id_overall', max_overall => id).write();
   },
   get_max_id: function() {
      return tweets_db.get('max_id').value();
   },
   set_max_id: function(id) {
      tweets_db.update('max_id', max_id => id).write();
   },
   get_since_id: function() {
      return tweets_db.get('since_id').value();
   },
   set_since_id: function(id) {
      return tweets_db.update('since_id', since => id).write();
   },
   update: function(fetched = []) {
      const old = tweets_db.get('old').value();

      const new_tweets = fetched.filter(tweet => {
         let is_exist = tweets_db
            .get('old')
            .find({ id_str: tweet.id_str })
            .value();
         return !is_exist;
      });

      tweets_db
         .get('new')
         .assign(new_tweets)
         .write();
   },
   old: function() {
      const old_tweets = tweets_db.get('old').value();
      return [...old_tweets];
   },
   get_new: function() {
      const new_tweets = tweets_db.get('new').value();
      return [...new_tweets];
   },
   move: function(id_str) {
      let tweet = tweets_db
         .get('new')
         .find({ id_str: id_str })
         .value();

      tweets_db
         .get('old')
         .push(tweet)
         .write();

      tweets_db
         .get('new')
         .remove({ id_str: id_str })
         .write();
   },
   add_text: function(data = {}) {
      tweets_db
         .get('texts')
         .push(data)
         .write();
   },
   get_text: function() {
      return tweets_db
         .get('texts')
         .last()
         .value();
   },
   is_texts_empty: function() {
      return tweets_db
         .get('texts')
         .isEmpty()
         .value();
   },
   move_text: function(id_str = '') {
      let text = tweets_db
         .get('texts')
         .find({ id_str: id_str })
         .value();

      tweets_db
         .get('tweeted')
         .push(text)
         .write();

      tweets_db
         .get('texts')
         .remove({ id_str: id_str })
         .write();
   }
};

const photos = {
   root: photos_db,
   get_keyword: function() {
      return photos_db.get('keywords').value();
   },
   get_page: function() {
      return photos_db.get('page').value();
   },
   get_count: function() {
      return photos_db.get('count').value();
   },
   get_photos: function() {
      return photos_db.get('photos').value();
   },
   get_photo: function(id) {
      return photos_db
         .get('photos')
         .find({ id: id })
         .value();
   },
   get_random_photo: function() {
      let photo = {};
      if (this.is_photo_empty()) {
         throw new Error('there is no photo currently');
      }
      return photos_db
         .get('photos')
         .sample()
         .value();
   },
   add_new: function(results = [], total_photo, total_page) {
      results.map(photo => {
         photos_db
            .get('photos')
            .push(photo)
            .write();
      });

      results.map(photo => {
         let { tags } = photo;
         photos_db
            .get('tags')
            .push(tags)
            .write();
      });

      this.update_count(results.length);
      this.update_page();
      this.update_total_page(total_page);
      this.update_total_photo(total_photo);
   },
   update_page: function() {
      photos_db.update('page', page => page + 1).write();
   },
   update_count: function(number = 0) {
      photos_db.update('count', count => count + number).write();
   },
   update_total_photo: function(number = 0) {
      photos_db.update('total_photo', total_photo => number).write();
   },
   update_total_page: function(number) {
      photos_db.update('total_page', total_page => total_page).write();
   },
   set_keywords: function(keywords) {
      photos_db.update('keywords', current => keywords).write();
   },
   is_photo_empty: function() {
      return photos_db
         .get('photos')
         .isEmpty()
         .value();
   }
};

export default { photos, messages, tweets };
