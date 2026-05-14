import { z } from 'zod';

export const moduleFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Título é obrigatório e deve ter pelo menos 2 caracteres')
    .max(100, 'Título é obrigatório e deve ter no máximo 100 caracteres'),
  id_grammarRules: z
    .array(z.string())
    .min(1, 'Selecione ao menos um tópico')
    .max(5, 'Máximo de 5 tópicos'),
  id_level: z.string().min(1, 'Selecione o nível de dificuldade'),
  description: z
    .string()
    .trim()
    .min(10, 'Descrição deve ter no mínimo 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  estimatedTime: z
    .number({
      required_error: 'Informe o tempo estimado',
      invalid_type_error: 'Informe o tempo estimado',
    })
    .min(1, 'O tempo estimado deve ter no mínimo 1 minuto')
    .max(600, 'O tempo estimado deve ter no máximo 600 minutos'),
});

export type ModuleForm = z.infer<typeof moduleFormSchema>;
