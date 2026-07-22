import Trilha from '../models/trilha.model.js';
import Avaliacao from '../models/avaliacao.model.js';
import { gerarAvaliacao } from '../ai/gemini.provider.js';
import { ZodError } from 'zod';

const TIPOS = ['diagnostica', 'progresso'];
const DIFICULDADES = ['iniciante', 'intermediario', 'avancado'];

export async function criarAvaliacao(req, res) {
  try {
    const { trilhaId, tipo, dificuldade } = req.body;

    if (!trilhaId) {
      return res.status(400).json({ erro: 'trilhaId é obrigatório' });
    }
    if (!TIPOS.includes(tipo)) {
      return res.status(400).json({ erro: `tipo inválido (use: ${TIPOS.join(', ')})` });
    }
    if (!DIFICULDADES.includes(dificuldade)) {
      return res.status(400).json({ erro: `dificuldade inválida (use: ${DIFICULDADES.join(', ')})` });
    }

    const trilha = await Trilha.findByPk(trilhaId);
    if (!trilha) {
      return res.status(404).json({ erro: 'Trilha não encontrada' });
    }

   const questoes = await gerarAvaliacao({ trilha, tipo, dificuldade });

   const avaliacao = await Avaliacao.create({
     userId: trilha.userId,
     trilhaId: trilha.id,
     tipo,
     dificuldade,
     questoes,
   });

   return res.status(201).json({ avaliacao });
  } catch (err) {
    if (err instanceof ZodError || err.message?.includes('JSON inválido')) {
      console.error('Falha na geração da IA:', err);
      return res.status(502).json({ erro: 'A IA retornou um resultado inválido, tente novamente' });
    }
    console.error('Erro interno ao criar avaliação:', err);
    return res.status(500).json({ erro: 'Erro interno ao criar avaliação' });
  }
}