import express from 'express';
import db from '../helper/database';

const app = express.Router();

app.get('/photos', (req, res, next) => {
   const photos = db.photos.get('photos').value();
   res.json(photos);
});

app.get('/photos/tags', (req, res, next) => {
   const tags = db.photos.get('tags').value();
   res.json(tags);
});

app.get('/photos/metadata', (req, res, next) => {
   const keywords = db.photos.get('keywords').value();
   const count = db.photos.get('count').value();
   const total_photo = db.photos.get('total_photo').value();
   const total_page = db.photos.get('total_page').value();
   const page = db.photos.get('page').value();
   res.json({ keywords, total_page, page, total_photo, count });
});

app.post('/photos/keywords', (req, res) => {
   if (!req.body.keywords) {
      res.send({ messages: 'keywords is null or undefined' });
   }
   db.photos.update('keywords', old_keywords => req.body.keywords);
   res.send({ messages: `keywords changed into ${req.body.keywords}` });
});

export default app;
