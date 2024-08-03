import express from 'express';
import dotenv from 'dotenv';
import booksRouter from './routes/books.js';
import membersRouter from './routes/members.js';
import borrowRouter from './routes/borrow.js';
import returnRouter from './routes/return.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/books', booksRouter);
app.use('/members', membersRouter);
app.use('/borrow', borrowRouter);
app.use('/return', returnRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
