import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();
import {connectDB} from './db.js'
import booksRouter from './routes/books.js';
import paginationRouter from './routes/pagination.js'
//authentification
import authRouter from './routes/auth.js';

let app = express();
const PORT = process.env.PORT||3000;

// for post requests
app.use(express.json());
//morgan middleware
app.use(morgan("dev"));
app.use(express.static("public"));
app.use("/books",booksRouter);
app.use("/auth",authRouter);
app.use('/pagination',paginationRouter);
connectDB().then ( () => {
    app.listen(PORT, () => {
        console.log('server started on port ' , PORT)
    })
});
