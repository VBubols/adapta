import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { diagnosticSchema } from '../schemas/study.schema.js'; 
import { trilhaSchema } from '../schemas/trilha.schema.js';

let ai;
function getClient() {
  if (!ai) ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
  return ai;
}

// Converte o schema Zod em JSON Schema uma vez só (não a cada request)
const diagnosticJsonSchema = z.toJSONSchema(diagnosticSchema);

const systemInstruction =
  'Você é um avaliador pedagógico. Gere uma avaliação objetiva em português do Brasil. ' +
  'Regras de formato: as alternativas devem vir SEM prefixo (nada de "A)", "B)"); ' +
  '"respostaCorreta" é o ÍNDICE (0 a 3) da alternativa correta dentro do array "alternativas"; ' +
  'distribua as questões entre os tópicos e habilidades fornecidos; ' +
  'a "dificuldade" de cada questão deve girar em torno da dificuldade pedida.';

export async function gerarAvaliacao({ trilha, tipo, dificuldade, quantidade = 5 }) {
  const client = getClient();

  const descricao = trilha.descricao || 'sem descrição';
  const competencias = JSON.stringify(trilha.competencias || []);
  const topicos = JSON.stringify(trilha.topicos || []);
  const habilidades = JSON.stringify(trilha.habilidades || []);

  const contents =
    `Gere uma avaliação do tipo "${tipo}" com ${quantidade} questões objetivas, ` +
    `dificuldade predominante "${dificuldade}", para a trilha a seguir.\n` +
    `Título: ${trilha.titulo}\n` +
    `Descrição: ${descricao}\n` +
    `Competências: ${competencias}\n` +
    `Tópicos: ${topicos}\n` +
    `Habilidades: ${habilidades}`;

  const response = await client.models.generateContent({
    model: 'gemini-3.5-flash',
    contents,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseJsonSchema: diagnosticJsonSchema,
    },
  });

  // response.text é a string JSON gerada pela IA
  let parsed;
  try {
    parsed = JSON.parse(response.text);
  } catch {
    throw new Error('IA retornou um JSON inválido (não parseou)');
  }

  // Valida contra o Zod — fonte da verdade do formato. Se falhar, lança ZodError.
  const resultado = diagnosticSchema.parse(parsed);

  // Devolve só o array — o controller grava isto direto na coluna "questoes"
  return resultado.questoes;
}

const trilhaJsonSchema = z.toJSONSchema(trilhaSchema);

const systemInstructionTrilha =
  'Você é um especialista em design instrucional. Gere uma trilha de aprendizagem em português do Brasil ' +
  'sobre o tema informado. "competencias", "topicos" e "habilidades" devem ser listas de frases curtas e ' +
  'objetivas (não objetos aninhados). Gere de 4 a 8 tópicos coerentes e progressivos, do básico ao avançado. ' +
  'O "titulo" deve ser claro e a "descricao" deve ter de 1 a 3 frases.';

export async function gerarTrilha({ tema }) {
  const client = getClient();

  const contents = `Gere uma trilha de aprendizagem completa sobre o seguinte tema: "${tema}".`;

  const response = await client.models.generateContent({
    model: 'gemini-3.5-flash',
    contents,
    config: {
      systemInstruction: systemInstructionTrilha,
      responseMimeType: 'application/json',
      responseJsonSchema: trilhaJsonSchema,
    },
  });

  let parsed;
  try {
    parsed = JSON.parse(response.text);
  } catch {
    throw new Error('IA retornou um JSON inválido (não parseou)');
  }

  // Aqui o schema é um objeto plano — devolve ele INTEIRO (mapeia 1:1 com as colunas)
  return trilhaSchema.parse(parsed);
}