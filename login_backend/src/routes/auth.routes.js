import express from 'express';
import { cadastrar, login } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/cadastro', cadastrar);
authRouter.post('/login', login);

export default authRouter;