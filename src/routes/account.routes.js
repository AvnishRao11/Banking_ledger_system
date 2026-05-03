import express from 'express';
const router=express.Router();
import { authMiddleware } from '../Middlewares/auth.middleware.js';
import { createAccountController } from '../controllers/account.controllers.js';
/**
 * POST-/api/accounts/
 * -create a new account 
 * Protected Route 
 */
router.post ('/',authMiddleware,createAccountController)



export default router;