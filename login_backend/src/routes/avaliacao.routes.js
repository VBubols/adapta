import { gerarAvalicao } from '../controllers/avaliacao.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';
import express from 'express';

const avaliacaoRouter = express.Router();

avaliacaoRouter.post('/', autenticar, gerarAvalicao);

export default avaliacaoRouter;