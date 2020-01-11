import express from 'express';
import db from '../helper/database';
const app = express.Router();

app.get('/messages/new', (req, res, next) => {
   const news = db.messages.get_new();
   res.json(news);
});

app.get('/messages/old', (req, res, next) => {
   const old = db.messages.root.get('old').value();
   res.json(old);
});

app.get('/messages/texts', (req, res, next) => {
   const texts = db.messages.get_text();
   res.json(texts);
});

app.get('/messages/tweeted', (req, res, next) => {
   const tweeted = db.messages.root.get('tweeted').value();
   res.json(tweeted);
});

app.get('/messages/cursor', (req, res, next) => {
   const cursor = db.messages.get_cursor();
   res.json(cursor);
});

export default app;
