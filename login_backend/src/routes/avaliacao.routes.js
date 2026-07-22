import { criarAvaliacao } from '../controllers/avaliacao.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';
import express from 'express';

const avaliacaoRouter = express.Router();

avaliacaoRouter.post('/', criarAvaliacao);

export default avaliacaoRouter;