import type { ExerciseRequest, ExerciseResponse } from '@/features/module/types/exercise';
import { api } from '@/app/libs/api';

interface ModuleFinalChallengeExerciseResponse {
  message: string;
  data: ExerciseResponse;
}

interface createFinalChallengeExerciseRequest {
  data: ExerciseRequest;
  moduleId: string;
}

export const createFinalChallengeExercise = async ({
  data,
  moduleId,
}: createFinalChallengeExerciseRequest) => {
  const response = await api.post<ModuleFinalChallengeExerciseResponse>(
    `/modules/${moduleId}/final-challenge`,
    data,
  );
  return response.data;
};
