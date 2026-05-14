import type { ExerciseBaseResponse } from '@/features/module/types/exercise';
import { api } from '@/app/libs/api';

export interface GetFinalChallengeExercisesResponse {
  message: string;
  data: ExerciseBaseResponse[];
}

interface GetFinalChallengeExercisesRequest {
  moduleId: string | undefined;
}

export const getFinalChallengeExercises = async ({
  moduleId,
}: GetFinalChallengeExercisesRequest): Promise<GetFinalChallengeExercisesResponse> => {
  const response = await api.get(`/modules/${moduleId}/final-challenge`);
  return response.data;
};
