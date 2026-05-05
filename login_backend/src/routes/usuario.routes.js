import express from 'express';
import { perfil, atualizarPerfil, atualizarSenha } from '../controllers/usuario.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';
import { limitadorUsuario } from '../config/rateLimit.js';

const userRouter = express.Router();

userRouter.get('/perfil', autenticar, limitadorUsuario, perfil);
userRouter.post('/perfil', autenticar, atualizarPerfil);
userRouter.post('/senha', autenticar, atualizarSenha);

export default userRouter;