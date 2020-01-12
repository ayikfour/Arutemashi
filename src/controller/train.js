import { Corpus, Document, Similarity } from 'tiny-tfidf';
import db from '../helper/database';
import logger from '../utils/logger';

function tags() {
   const log = logger('train');
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
      log.process('search', 'search related tags based on current keyword');
      let query = corpus.getResultsForQuery('moody');

      if (query.length == 0) {
         throw new Error('there is no mathcing keywords');
      }

      let result = query.shift()[0];
      let photo = db.photos.get_photo(result);
      result = photo.tags.join(' ');

      log.process('set', `set keyowrds to ${result}`);
      db.photos.set_keywords(result);

      log.success('keyword has been updated');
   } catch (error) {
      log.error(error.message);
   }
}

export default { tags };
