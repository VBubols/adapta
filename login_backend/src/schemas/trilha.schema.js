import { z } from 'zod';

export const trilhaSchema = z.object({
  titulo: z.string().min(1),
  descricao: z.string().min(1),
  competencias: z.array(z.string().min(1)).min(1),
  topicos: z.array(z.string().min(1)).min(1),
  habilidades: z.array(z.string().min(1)).min(1),
});