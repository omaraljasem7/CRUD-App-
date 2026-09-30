import express from 'express';
import {getBookById,getAllBooks,createBook,createBookValid,deleteBook,updateBook,replaceBook,paginateBook} from '../controllers/bookController.js'
import {verifyToken} from "../middelware/authMiddleware.js";

const router=express.Router();
router.get('/',getAllBooks);
router.get('/:id',getBookById);
router.post('/',verifyToken,createBookValid);
router.patch('/:id',verifyToken,updateBook);
router.put('/:id',verifyToken,replaceBook);
router.delete('/:id',verifyToken,deleteBook);
router.get('/pagination',paginateBook)
export default router;