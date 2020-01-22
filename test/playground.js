import tweet from '../src/controller/tweet';
import image from '../src/controller/image';
import mention from '../src/controller/mention';
import message from '../src/controller/message';
import { Corpus, Document, Similarity } from 'tiny-tfidf';
import arute from '../src/controller/arute';
import db from '../src/helper/database';
async function trains() {
   try {
      let names = db.photos.get_photos();
      names = names.map(photo => {
         return photo.id;
      });

      let tags = db.photos.root.get('tags').value();
      tags = tags.map(tag => {
         return tag.join(' ');
      });

      const corpus = new Corpus(names, tags);
      let query = corpus.getResultsForQuery('moody');

      if (query.length == 0) {
         throw new Error('there is no mathcing keywords');
      }

      let result = query.shift()[0];
      let photo = db.photos.get_photo(result);
      result = photo.tags.join(' ');
      db.photos.set_keywords(result);
   } catch (error) {
      console.log(error);
   }
}

async function draw() {
   try {
      await image.tumblr(
         'Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt'
      );
      console.log('done');
   } catch (error) {
      console.log(error);
   }
}

async function test() {
   try {
      // const result = await tweet.get_tweet('1212203254034993152');
      // console.log(result);
      // await mention.consume();
      // await mention.fetch();
      await arute.jpg();
      // console.log(image.random_id());
      // await message.consume();
      // await image.story('bacot ngentoott');
   } catch (error) {
      console.log(error);
   }
}
test();
// trains();
