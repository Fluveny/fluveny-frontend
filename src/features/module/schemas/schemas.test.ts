import { describe, expect, it } from 'vitest';
import { BuildPhraseExerciseSchema } from './build-phrase-schema';
import { FillInTheBlankSchema } from './fill-in-the-blanks-schema';
import { TranslateExerciseSchema } from './translate-exercise-schema';

describe('TranslateExerciseSchema', () => {
  it('should accept valid data', () => {
    const validData = {
      header: 'Translate the following',
      phrase: 'Hello world',
      template: 'Olá mundo',
      justification: 'Direct translation',
    };
    expect(() => TranslateExerciseSchema.parse(validData)).not.toThrow();
  });

  it('should reject empty header', () => {
    const invalidData = {
      header: '',
      phrase: 'Hello',
      template: 'Olá',
      justification: 'Because',
    };
    const result = TranslateExerciseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject empty phrase', () => {
    const invalidData = {
      header: 'Header',
      phrase: '',
      template: 'Olá',
      justification: 'Because',
    };
    const result = TranslateExerciseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject empty template', () => {
    const invalidData = {
      header: 'Header',
      phrase: 'Hello',
      template: '',
      justification: 'Because',
    };
    const result = TranslateExerciseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject empty justification', () => {
    const invalidData = {
      header: 'Header',
      phrase: 'Hello',
      template: 'Olá',
      justification: '',
    };
    const result = TranslateExerciseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should trim whitespace from fields', () => {
    const data = {
      header: '  Header  ',
      phrase: '  Phrase  ',
      template: '  Template  ',
      justification: '  Justification  ',
    };
    const result = TranslateExerciseSchema.parse(data);
    expect(result.header).toBe('Header');
    expect(result.phrase).toBe('Phrase');
    expect(result.template).toBe('Template');
    expect(result.justification).toBe('Justification');
  });
});

describe('BuildPhraseExerciseSchema', () => {
  it('should accept valid data', () => {
    const validData = {
      originalSentence: 'The cat is sleeping',
      translation: 'O gato está dormindo',
      distractors: ['running', 'eating'],
    };
    expect(() => BuildPhraseExerciseSchema.parse(validData)).not.toThrow();
  });

  it('should reject empty originalSentence', () => {
    const invalidData = {
      originalSentence: '',
      translation: 'Translation',
      distractors: [],
    };
    const result = BuildPhraseExerciseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject more than 5 distractors', () => {
    const invalidData = {
      originalSentence: 'Sentence',
      translation: 'Translation',
      distractors: ['a', 'b', 'c', 'd', 'e', 'f'],
    };
    const result = BuildPhraseExerciseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should accept empty distractors array', () => {
    const validData = {
      originalSentence: 'Sentence',
      translation: 'Translation',
      distractors: [],
    };
    expect(() => BuildPhraseExerciseSchema.parse(validData)).not.toThrow();
  });
});

describe('FillInTheBlankSchema', () => {
  it('should accept valid data with TEXT and GAP elements', () => {
    const validData = {
      header: 'Fill in the blanks',
      phrase: [
        { type: 'TEXT' as const, content: 'The ' },
        {
          type: 'GAP' as const,
          words: ['cat', 'dog'],
          justification: 'animal',
        },
        { type: 'TEXT' as const, content: ' is here' },
      ],
    };
    expect(() => FillInTheBlankSchema.parse(validData)).not.toThrow();
  });

  it('should reject empty header', () => {
    const invalidData = {
      header: '',
      phrase: [{ type: 'TEXT' as const, content: 'hello' }],
    };
    const result = FillInTheBlankSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject empty phrase array', () => {
    const invalidData = {
      header: 'Header',
      phrase: [],
    };
    const result = FillInTheBlankSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
