import express from 'express';
import { criarTrilha, listarTrilhas, obterTrilha } from '../controllers/trilha.controller.js';
import { autenticar } from '../middlewares/auth.middleware.js';

const trilhaRouter = express.Router();

trilhaRouter.use(autenticar);

trilhaRouter.post('/', criarTrilha);
trilhaRouter.get('/', listarTrilhas);
trilhaRouter.get('/:id', obterTrilha);

export default trilhaRouter;
