import Trilha from '../models/trilha.model.js';
import Avaliacao from '../models/avaliacao.model.js';
import { gerarAvaliacao } from '../ai/gemini.provider.js';
import { ZodError } from 'zod';

const TIPOS = ['diagnostica', 'progresso'];
const DIFICULDADES = ['iniciante', 'intermediario', 'avancado'];

// Corrige a avaliação comparando as respostas do aluno com o gabarito das questões.
// Retorna nota (0-10), nível classificado e desempenho por tópico (RF09/RF10/RF12).
function corrigir(questoes, respostas) {
  let acertos = 0;
  const porTopico = {};

  questoes.forEach((questao, i) => {
    const escolhida = respostas[i];
    const correta = escolhida === questao.respostaCorreta;
    if (correta) acertos += 1;

    const topico = questao.topico || 'Geral';
    if (!porTopico[topico]) porTopico[topico] = { acertos: 0, total: 0 };
    porTopico[topico].total += 1;
    if (correta) porTopico[topico].acertos += 1;
  });

  const total = questoes.length;
  const percentual = total > 0 ? acertos / total : 0;
  const nota = Math.round(percentual * 100) / 10; // 0-10, uma casa decimal

  let nivel;
  if (percentual < 0.5) nivel = 'iniciante';
  else if (percentual < 0.8) nivel = 'intermediario';
  else nivel = 'avancado';

  const desempenho = Object.entries(porTopico).map(([topico, d]) => ({
    topico,
    acertos: d.acertos,
    total: d.total,
  }));

  return { acertos, total, nota, nivel, desempenho };
}

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
      userId: req.usuario.id, // aluno logado (via JWT)
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

// Envia respostas, corrige, grava nota/nível e devolve o gabarito (RF09/RF10/RF23).
export async function responderAvaliacao(req, res) {
  try {
    const { id } = req.params;
    const { respostas } = req.body;

    const avaliacao = await Avaliacao.findByPk(id);
    if (!avaliacao) {
      return res.status(404).json({ erro: 'Avaliação não encontrada' });
    }
    if (avaliacao.userId !== req.usuario.id) {
      return res.status(403).json({ erro: 'Esta avaliação não pertence a você' });
    }
    if (!Array.isArray(respostas) || respostas.length !== avaliacao.questoes.length) {
      return res.status(400).json({
        erro: `Envie um array "respostas" com ${avaliacao.questoes.length} itens (índice 0-3 por questão)`,
      });
    }

    const resultado = corrigir(avaliacao.questoes, respostas);

    avaliacao.respostas = respostas;
    avaliacao.nota = resultado.nota;
    avaliacao.nivel = resultado.nivel;
    await avaliacao.save();

    return res.status(200).json({
      avaliacao,
      resultado, // acertos, total, nota, nivel, desempenho por tópico
    });
  } catch (err) {
    console.error('Erro ao corrigir avaliação:', err);
    return res.status(500).json({ erro: 'Erro interno ao corrigir avaliação' });
  }
}

export async function listarAvaliacoes(req, res) {
  try {
    const filtro = { userId: req.usuario.id };
    if (req.query.trilhaId) filtro.trilhaId = req.query.trilhaId;

    const avaliacoes = await Avaliacao.findAll({
      where: filtro,
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({ avaliacoes });
  } catch (err) {
    console.error('Erro ao listar avaliações:', err);
    return res.status(500).json({ erro: 'Erro interno ao listar avaliações' });
  }
}

export async function obterAvaliacao(req, res) {
  try {
    const avaliacao = await Avaliacao.findByPk(req.params.id);
    if (!avaliacao) {
      return res.status(404).json({ erro: 'Avaliação não encontrada' });
    }
    if (avaliacao.userId !== req.usuario.id) {
      return res.status(403).json({ erro: 'Esta avaliação não pertence a você' });
    }
    return res.status(200).json({ avaliacao });
  } catch (err) {
    console.error('Erro ao obter avaliação:', err);
    return res.status(500).json({ erro: 'Erro interno ao obter avaliação' });
  }
}
