import express from 'express';
import db from '../helper/database';
const app = express.Router();

app.get('/mentions/new', (req, res, next) => {
   const news = db.tweets.get('new').value();
   res.json(news);
});

app.get('/mentions/old', (req, res, next) => {
   const old = db.tweets.get('old').value();
   res.json(old);
});

app.get('/mentions/ids', (req, res, next) => {
   const max_id = db.tweets.get('max_id').value();
   const max_id_overall = db.tweets.get('max_id_overall').value();
   const since_id = db.tweets.get('since_id').value();
   res.json({ max_id, max_id_overall, since_id });
});

app.get('/mentions/tweeted', (req, res, next) => {
   const tweeted = db.tweets.get('tweeted').value();
   res.json(tweeted);
});

app.get('/mentions/texts', (req, res, next) => {
   const texts = db.tweets.get('texts').value();
   res.json(texts);
});

app.post('/mentions/max_id', (req, res) => {
   if (!req.body.max_id) {
      res.send({ message: 'max_id is null or undefined' });
   }
   db.tweets.update('max_id', max_id => req.body.max_id).write();
   res.json(req.max_id);
});

app.post('/mentions/since_id', (req, res) => {
   if (!req.body.since_id) {
      res.send({ message: 'since_id is null or undefined' });
   }
   db.tweets.update('since_id', since_id => req.body.since_id).write();
   res.json(req.body.since_id);
});

app.post('/mentions/max_id_overall', (req, res) => {
   if (!req.body.max_id_overall) {
      res.send({ message: 'max_id_overall is null or undefined' });
   }
   db.tweets
      .update('max_id_overall', max_id_overall => req.body.max_id_overall)
      .write();
   res.json(req.body.max_id_overall);
});

export default app;
