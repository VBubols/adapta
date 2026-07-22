import Trilha from '../models/trilha.model.js';
import Avaliacao from '../models/avaliacao.model.js';
import StudyPlan from '../models/studyplan.model.js';
import { gerarPlano } from '../ai/gemini.provider.js';
import { ZodError } from 'zod';

// Recalcula o desempenho por tópico a partir das respostas já gravadas na avaliação.
// Usado para personalizar o plano (adaptativo) sem precisar de coluna extra.
function desempenhoDaAvaliacao(avaliacao) {
  if (!avaliacao?.respostas) return null;
  const porTopico = {};
  avaliacao.questoes.forEach((questao, i) => {
    const correta = avaliacao.respostas[i] === questao.respostaCorreta;
    const topico = questao.topico || 'Geral';
    if (!porTopico[topico]) porTopico[topico] = { acertos: 0, total: 0 };
    porTopico[topico].total += 1;
    if (correta) porTopico[topico].acertos += 1;
  });
  return {
    nivel: avaliacao.nivel,
    nota: avaliacao.nota,
    porTopico: Object.entries(porTopico).map(([topico, d]) => ({ topico, ...d })),
  };
}

export async function criarPlano(req, res) {
  try {
    const { trilhaId, avaliacaoId } = req.body;

    if (!trilhaId) {
      return res.status(400).json({ erro: 'trilhaId é obrigatório' });
    }

    const trilha = await Trilha.findByPk(trilhaId);
    if (!trilha) {
      return res.status(404).json({ erro: 'Trilha não encontrada' });
    }
    if (trilha.userId !== req.usuario.id) {
      return res.status(403).json({ erro: 'Esta trilha não pertence a você' });
    }

    // Se um diagnóstico foi informado, usa o desempenho pra personalizar o plano.
    let desempenho = null;
    if (avaliacaoId) {
      const avaliacao = await Avaliacao.findByPk(avaliacaoId);
      if (avaliacao && avaliacao.userId === req.usuario.id) {
        desempenho = desempenhoDaAvaliacao(avaliacao);
      }
    }

    const cronograma = await gerarPlano({ trilha, desempenho });

    const plano = await StudyPlan.create({
      userId: req.usuario.id,
      trilhaId: trilha.id,
      avaliacaoId: avaliacaoId || null,
      cronograma,
    });

    return res.status(201).json({ plano });
  } catch (err) {
    if (err instanceof ZodError || err.message?.includes('JSON inválido')) {
      console.error('Falha na geração da IA:', err);
      return res.status(502).json({ erro: 'A IA retornou um resultado inválido, tente novamente' });
    }
    console.error('Erro interno ao criar plano:', err);
    return res.status(500).json({ erro: 'Erro interno ao criar plano' });
  }
}

export async function listarPlanos(req, res) {
  try {
    const filtro = { userId: req.usuario.id };
    if (req.query.trilhaId) filtro.trilhaId = req.query.trilhaId;

    const planos = await StudyPlan.findAll({
      where: filtro,
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ planos });
  } catch (err) {
    console.error('Erro ao listar planos:', err);
    return res.status(500).json({ erro: 'Erro interno ao listar planos' });
  }
}

export async function obterPlano(req, res) {
  try {
    const plano = await StudyPlan.findByPk(req.params.id);
    if (!plano) {
      return res.status(404).json({ erro: 'Plano não encontrado' });
    }
    if (plano.userId !== req.usuario.id) {
      return res.status(403).json({ erro: 'Este plano não pertence a você' });
    }
    return res.status(200).json({ plano });
  } catch (err) {
    console.error('Erro ao obter plano:', err);
    return res.status(500).json({ erro: 'Erro interno ao obter plano' });
  }
}
