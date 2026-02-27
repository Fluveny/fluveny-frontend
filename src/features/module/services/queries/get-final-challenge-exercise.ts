import type { ExerciseResponse } from '@/features/module/types/exercise';
import { api } from '@/app/libs/api';

export interface GetFinalChallengeExerciseResponse {
  message: string;
  data: ExerciseResponse;
}

export interface GetFinalChallengeExerciseRequest {
  moduleId: string | undefined;
  exerciseId: string | undefined;
}

export const getFinalChallengeExercise = async ({
  moduleId,
  exerciseId,
}: GetFinalChallengeExerciseRequest): Promise<GetFinalChallengeExerciseResponse> => {
  const response = await api.get(
    `/modules/${moduleId}/final-challenge/${exerciseId}`,
  );
  return response.data;
};
