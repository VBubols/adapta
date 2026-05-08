import express from 'express';
import {  } from '../controllers/estudante.controller.js';

const estudanteRouter = express.Router();

estudanteRouter.get('/', listarAlunos);
// estudanteRouter.post('/:id', listarAlunoPorId);

export default estudanteRouter;