import express from 'express'
import cookieParser from 'cookie-parser'
const app = express();
app.use(express.json());
app.use(cookieParser());

/**
 * - Routes Required
 */
import authRouter from './routes/auth.routes.js'
import accountRouter from './routes/account.routes.js'

/**
 * -  User-defined  Routes used 
 **/

app.use('/api/auth', authRouter);
app.use('/api/accounts',accountRouter)
// app.use('/api/transcation',transactionRouter);


export default app;