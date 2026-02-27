import type { ExerciseRequest } from '@/features/module/types/exercise';
import { createFinalChallengeExercise } from '@/features/module/services/mutation/create-final-challenge-exercise';
import { useMutation } from '@tanstack/react-query';

interface createFinalChallengeExerciseRequest {
  data: ExerciseRequest;
  moduleId: string;
}

export function useCreateFinalChallengeExercise() {
  return useMutation({
    mutationFn: async ({
      data,
      moduleId,
    }: createFinalChallengeExerciseRequest) => {
      const response = await createFinalChallengeExercise({
        data,
        moduleId,
      });

      return response.data;
    },
  });
}
