import { z } from 'zod';

const textElementSchema = z.object({
  type: z.literal('TEXT'),
  content: z.string(),
});

const textElementSchemaWithID = z.object({
  id: z.string(),
  type: z.literal('TEXT'),
  content: z.string(),
});

const gapElementSchema = z.object({
  type: z.literal('GAP'),
  words: z.array(z.string()),
  justification: z.string(),
});

const gapElementSchemaWithID = z.object({
  id: z.string(),
  type: z.literal('GAP'),
  words: z.array(z.string()),
  justification: z.string(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const phraseElementSchema = z.discriminatedUnion('type', [
  textElementSchemaWithID,
  gapElementSchemaWithID,
]);

export type PhraseElement = z.infer<typeof phraseElementSchema>;

export const FillInTheBlankWithIDSchema = z.object({
  header: z.string().trim().min(1, { message: 'Cabeçalho é obrigatório' }),
  phrase: z
    .array(
      z.discriminatedUnion('type', [
        textElementSchemaWithID,
        gapElementSchemaWithID,
      ]),
    )
    .min(1),
});

export const FillInTheBlankSchema = z.object({
  header: z.string().trim().min(1, { message: 'Cabeçalho é obrigatório' }),
  phrase: z
    .array(z.discriminatedUnion('type', [textElementSchema, gapElementSchema]))
    .min(1),
});

export type FillInTheBlankSchemaForm = z.infer<typeof FillInTheBlankSchema>;

export type FillInTheBlankSchemaWithIDForm = z.infer<
  typeof FillInTheBlankWithIDSchema
>;
