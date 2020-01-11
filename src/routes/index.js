import photo from './photo';
import mention from './mention';
import message from './message';
import express from 'express';

const app = express.Router();

app.use(photo);
app.use(mention);
app.use(message);

export default app;
