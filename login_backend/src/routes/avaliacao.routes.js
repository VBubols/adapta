import express from 'express';
import {
  criarAvaliacao,
  responderAvaliacao,
  listarAvaliacoes,
  obterAvaliacao,
} from '../controllers/avaliacao.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const avaliacaoRouter = express.Router();

// Todas as rotas de avaliação exigem estar logado (RF02/RF03).
avaliacaoRouter.use(autenticar);

avaliacaoRouter.post('/', criarAvaliacao);
avaliacaoRouter.get('/', listarAvaliacoes);
avaliacaoRouter.get('/:id', obterAvaliacao);
avaliacaoRouter.post('/:id/responder', responderAvaliacao);

export default avaliacaoRouter;
