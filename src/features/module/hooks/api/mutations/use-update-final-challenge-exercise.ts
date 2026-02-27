import type { ExerciseRequest } from '@/features/module/types/exercise';
import { updateFinalChallengeExercise } from '@/features/module/services/mutation/update-final-challenge-exercise';
import { useMutation } from '@tanstack/react-query';

interface updateFinalChallengeExerciseRequest {
  data: ExerciseRequest;
  moduleId: string;
  exerciseId: string;
}

export function useUpdateFinalChallengeExercise() {
  return useMutation({
    mutationFn: async ({
      data,
      moduleId,
      exerciseId,
    }: updateFinalChallengeExerciseRequest) => {
      await updateFinalChallengeExercise({
        data,
        moduleId,
        exerciseId,
      });
    },
  });
}
