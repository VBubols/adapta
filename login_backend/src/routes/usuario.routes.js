import express from 'express';
import { perfil, atualizarPerfil } from '../controllers/usuario.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.get('/perfil', autenticar, perfil);
userRouter.post('/perfil', autenticar, atualizarPerfil);

export default userRouter;