import photo from './photo';
import mention from './mention';
import express from 'express';

const app = express.Router();

app.use(photo);
app.use(mention);

export default app;
