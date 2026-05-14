import type { ExerciseStyle } from '@/features/module/types/exercise';
import { NotFound } from '@/templates/not-found';
import type React from 'react';
import { useParams } from 'react-router';
import { FormFinalChallengeBuildPhrasePage } from '../pages/form-final-challenge-build-phrase-page';
import { FormFinalChallengeExerciseTranslatePage } from '../pages/form-final-challenge-exercise-translate-page';
import { FormFinalChallengeFillInTheBlankPage } from '../pages/form-final-challenge-fill-in-the-blanks-page';

type LowercaseExerciseStyle = Lowercase<ExerciseStyle>;

export const ExerciseFinalChallengeOrchestrator = () => {
  const { style } = useParams<{
    style: LowercaseExerciseStyle;
  }>();

  const EXERCISE_COMPONENTS_MAP: Record<
    LowercaseExerciseStyle,
    React.ComponentType<any>
  > = {
    translate: FormFinalChallengeExerciseTranslatePage,
    organize: FormFinalChallengeBuildPhrasePage,
    fill_in_the_blank: FormFinalChallengeFillInTheBlankPage,
  };

  const ExerciseFormComponent = style
    ? EXERCISE_COMPONENTS_MAP[style]
    : undefined;

  if (!ExerciseFormComponent) {
    return <NotFound />;
  }

  return <ExerciseFormComponent />;
};
