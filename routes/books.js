import express from 'express';
import {getBookById,getAllBooks,createBook,createBookValid,deleteBook,updateBook,replaceBook,paginateBook} from '../controllers/bookController.js'
import {verifyToken} from "../middelware/authMiddleware.js";
// validation for POST and PATCH
import {validateBook,validateBookPatch} from '../middelware/validateMiddleware.js'

const router=express.Router();
router.get('/',getAllBooks);
router.get('/:id',getBookById);
router.post('/',verifyToken,validateBook,createBookValid);
router.patch('/:id',verifyToken,validateBookPatch,updateBook);
router.put('/:id',verifyToken,validateBook,replaceBook);
router.delete('/:id',verifyToken,deleteBook);
router.get('/pagination',paginateBook)
export default router;