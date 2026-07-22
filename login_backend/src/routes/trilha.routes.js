import express from 'express';
import { criarTrilha, listarTrilhas } from '../controllers/trilha.controller.js';

const trilhaRouter = express.Router();

trilhaRouter.post('/', criarTrilha);
trilhaRouter.get('/', listarTrilhas);

export default trilhaRouter;