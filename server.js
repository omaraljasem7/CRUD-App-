import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import {connectDB} from './db.js'
import booksRouter from './routes/books.js';
import paginationRouter from './routes/pagination.js'
let app = express();
const PORT = process.env.PORT||3000;

// for post requests
app.use(express.json());
app.use(express.static("public"));
app.use("/books",booksRouter);
app.use('/pagination',paginationRouter);
connectDB().then ( () => {
    app.listen(PORT, () => {
        console.log('server started on port ' , PORT)
    })
});
