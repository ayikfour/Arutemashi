import tweet from '../src/controller/tweet';
import image from '../src/controller/image';
import { Corpus, Document, Similarity } from 'tiny-tfidf';
import db from '../src/helper/database';
async function trains() {
   try {
      let names = db.photos.get_photos();
      names = names.map(photo => {
         return photo.id;
      });

      console.log(names);

      let tags = db.photos.root.get('tags').value();
      tags = tags.map(tag => {
         return tag.join(' ');
      });

      console.log(tags);

      const corpus = new Corpus(names, tags);

      console.log(corpus.getResultsForQuery('mood'));
   } catch (error) {
      console.log(error);
   }
}

async function test() {
   try {
      await image.polaroid(
         'Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt Bangsatttttt'
      );
      console.log('done');
   } catch (error) {
      console.log(error);
   }
}

test();
// trains();
