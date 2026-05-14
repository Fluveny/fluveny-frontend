import type { ExerciseStyle } from '@/features/module/types/exercise';

export type Module = {
  id: string;
  title: string;
  description: string;
  level: Level;
  estimatedTime: number;
  grammarRules: GrammarRule[];
};

export type ModuleStudent = {
  id: string;
  title: string;
  description: string;
  level: Level;
  estimatedTime: number;
  grammarRules: GrammarRule[];
  progressPercentage: number;
  isFavorite: boolean;
};

export type Level = {
  id: string;
  title: string;
  experienceValue: number;
};

export type GrammarRule = {
  id: string;
  title: string;
  slug: string;
};

export interface GrammarRuleModuleWindow {
  type: WindowType;
  id: string;
  grammarRuleModuleId: string;
  title: string;
  textBlock: {
    id: string;
    content: string;
  };
}

export type WindowListDTO = {
  type: WindowType;
  style?: ExerciseStyle;
  id?: string;
};

export type WindowType = 'EXERCISE' | 'PRESENTATION';

export interface Introduction {
  idModule: string;
  textBlock: TextBlock;
}

type TextBlock = {
  id: string;
  content: string;
};

export type GrammarRuleModuleIdAndTitle = {
  id: string;
  title: string;
};

export type Presentation = {
  title: string;
  textBlock: {
    content: string;
  };
};

export type LinguisticAbility = 'WRITE' | 'READ' | 'LISTEN';
