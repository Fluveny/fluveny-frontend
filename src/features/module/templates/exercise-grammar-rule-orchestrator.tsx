import type { ExerciseStyle } from '@/features/module/types/exercise';
import { NotFound } from '@/templates/not-found';
import type React from 'react';
import { useParams } from 'react-router';
import { FormGrammarRuleBuildPhrasePage } from '../pages/form-grammar-rule-build-phrase-page';
import { FormGrammarRuleExerciseTranslatePage } from '../pages/form-grammar-rule-exercise-translate-page';
import { FormGrammarRuleExerciseFillInTheBlankPage } from '../pages/form-grammar-rule-fill-in-the-blanks-page';

type LowercaseExerciseStyle = Lowercase<ExerciseStyle>;

export const ExerciseGrammarRuleOrchestrator = () => {
  const { style } = useParams<{
    style: LowercaseExerciseStyle;
  }>();

  const EXERCISE_COMPONENTS_MAP: Record<
    LowercaseExerciseStyle,
    React.ComponentType<any>
  > = {
    translate: FormGrammarRuleExerciseTranslatePage,
    organize: FormGrammarRuleBuildPhrasePage,
    fill_in_the_blank: FormGrammarRuleExerciseFillInTheBlankPage,
  };

  const ExerciseFormComponent = style
    ? EXERCISE_COMPONENTS_MAP[style]
    : undefined;

  if (!ExerciseFormComponent) {
    return <NotFound />;
  }

  return <ExerciseFormComponent />;
};
