import express from 'express';
import {getBookById,getAllBooks,createBook,createBookValid,deleteBook,updateBook,replaceBook,paginateBook} from '../controllers/bookController.js'

const router=express.Router();
router.get('/',getAllBooks);
router.get('/:id',getBookById);
router.post('/',createBookValid);
router.patch('/:id',updateBook);
router.put('/:id',replaceBook);
router.delete('/:id',deleteBook);
router.get('/pagination',paginateBook)
export default router;