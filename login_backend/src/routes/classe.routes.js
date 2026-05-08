import express from 'express';
import { listarAlunosEmRisco } from '../controllers/classe.controller.js';

const classRouter = express.Router();

classRouter.get('/alunosEmRisco', listarAlunosEmRisco);
// classRouter.post('/:id', listarAlunoPorId);

export default classRouter;