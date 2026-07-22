import Trilha from '../models/trilha.model.js';
import { gerarTrilha } from '../ai/gemini.provider.js';
import { ZodError } from 'zod';

export async function criarTrilha(req, res) {
  try {
    const { tema, userId } = req.body;

    if (!tema || typeof tema !== 'string' || !tema.trim()) {
      return res.status(400).json({ erro: 'tema é obrigatório' });
    }
    if (!userId) {
      return res.status(400).json({ erro: 'userId é obrigatório' }); 
    }

    const dados = await gerarTrilha({ tema });

    const trilha = await Trilha.create({ ...dados, userId });

    return res.status(201).json({ trilha });
  } catch (err) {
    if (err instanceof ZodError || err.message?.includes('JSON inválido')) {
      console.error('Falha na geração da IA:', err);
      return res.status(502).json({ erro: 'A IA retornou um resultado inválido, tente novamente' });
    }
    console.error('Erro interno ao criar trilha:', err);
    return res.status(500).json({ erro: 'Erro interno ao criar trilha' });
  }
}

export async function listarTrilhas(req, res) {
  try {
    const trilhas = await Trilha.findAll();
    return res.status(200).json({ trilhas });
  } catch (err) {
    console.error('Erro ao listar trilhas:', err);
    return res.status(500).json({ erro: 'Erro interno ao listar trilhas' });
  }
}