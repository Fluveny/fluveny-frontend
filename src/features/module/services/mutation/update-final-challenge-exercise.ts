import type { ExerciseRequest } from '@/features/module/types/exercise';
import { api } from '@/app/libs/api';

interface updateFinalChallengeExerciseRequest {
  data: ExerciseRequest;
  moduleId: string;
  exerciseId: string;
}

export const updateFinalChallengeExercise = async ({
  data,
  moduleId,
  exerciseId,
}: updateFinalChallengeExerciseRequest) => {
  const response = await api.put(
    `/modules/${moduleId}/final-challenge/${exerciseId}`,
    data,
  );
  return response.data;
};
