import express from 'express';
import { cadastrar, login } from '../controllers/auth.controller.js';
import { limitadorUsuario } from '../config/rateLimit.js';

const authRouter = express.Router();

authRouter.post('/cadastro', limitadorUsuario, cadastrar);
authRouter.post('/login', limitadorUsuario, login);

export default authRouter;