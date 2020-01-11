import express from 'express';
import db from '../helper/database';

const app = express.Router();

app.get('messages/new', (req, res, next) => {
   const news = db.messages.get('new').value();
   res.json(news);
});

app.get('/messages/old', (req, res, next) => {
   const old = db.messages.get('old').value();
   res.json(old);
});

app.get('/messages/texts', (req, res, next) => {
   const texts = db.messages.get('texts').value();
   res.json(texts);
});

app.get('/messages/tweeted', (req, res, next) => {
   const tweeted = db.messages.get('tweeted').value();
   res.json(tweeted);
});

app.get('/messages/cursor', (req, res, next) => {
   const cursor = db.messages.get('cursor').value();
   res.json(cursor);
});
