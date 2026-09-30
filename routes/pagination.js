import express from 'express';
import {paginateBook} from '../controllers/bookController.js'

const router = express.Router();
router.get('/',paginateBook);
export  default router;