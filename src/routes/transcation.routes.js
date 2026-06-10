import express from 'express'
import {createTransactionController,createInitialFundsTransactionController } from '../controllers/transaction.controllers.js';
import {authMiddleware,authSystemUserMiddleware} from '../Middlewares/auth.middleware.js'
const router=express.Router();

/***
 * -POST /api/transactions/
 * - create  a new transaction 
 */
router.post('/',authMiddleware,createTransactionController);
/***
 * - POST /api/transactions/intial-funds
 */

router.post('/initial-funds',authSystemUserMiddleware,createInitialFundsTransactionController);
export default router;