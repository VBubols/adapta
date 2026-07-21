import { z } from 'zod';

const questoesSchema = z.object({
    topico: z.string().min(1),
    habilidade: z.string(),
    dificuldade: z.enum(['iniciante', 'intermediario', 'avancado']),
    enunciado: z.string().min(1),
    alternativas: z.array(z.string()).length(4),
    respostaCorreta: z.number().int().min(0).max(3),
    explicacao: z.string().min(1)
});

export const diagnosticSchema = z.object({
    questoes: z.array(questoesSchema).min(1)
});

const cronogramaSchema = z.object({
    etapa: z.string().min(1),
    titulo: z.string().min(1),
    conteudos: z.array(z.string()),
    tempoEstimado: z.string().min(1)
});

export const studyPlanSchema = z.object({
    cronograma: z.array(cronogramaSchema).min(1)
});
