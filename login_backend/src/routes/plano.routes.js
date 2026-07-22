import express from 'express';
import { criarPlano, listarPlanos, obterPlano } from '../controllers/plano.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const planoRouter = express.Router();

planoRouter.use(autenticar);

planoRouter.post('/', criarPlano);
planoRouter.get('/', listarPlanos);
planoRouter.get('/:id', obterPlano);

export default planoRouter;
