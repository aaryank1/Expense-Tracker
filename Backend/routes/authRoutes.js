import express from 'express'
import { addUser, loginUser } from '../controllers/authentication.js';

const userRouter = express.Router();

userRouter.post('/register', addUser)
userRouter.post('/login', loginUser)

export default userRouter;