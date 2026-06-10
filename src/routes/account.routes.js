import express from 'express';
const router=express.Router();
import { authMiddleware } from '../Middlewares/auth.middleware.js';
import { createAccountController,getUserAccountController,getAccountBalanceController } from '../controllers/account.controllers.js';
/**
 * POST-/api/accounts/
 * -create a new account 
 * Protected Route 
 */
router.post ('/',authMiddleware,createAccountController)
/**
 * GET-/api/accounts/
 * - get all accounts of the logged in user 
 * Protected Route
 */
router.get('/',authMiddleware,getUserAccountController)
/***
 * GET /api/accounts/balance/:accountId
 * - get the balance of the logged in user 
 * Protected Route
 */
router.get('/balance/:accountId',authMiddleware,getAccountBalanceController)



export default router;