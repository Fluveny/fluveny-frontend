import type { ExerciseResponse } from '@/features/module/types/exercise';
import { api } from '@/app/libs/api';

export interface GetExerciseResponse {
  message: string;
  data: ExerciseResponse;
}

export interface GetExerciseRequest {
  moduleId: string | undefined;
  grammarRuleId: string | undefined;
  windowId: string | undefined;
}

export const getExercise = async ({
  moduleId,
  grammarRuleId,
  windowId,
}: GetExerciseRequest): Promise<GetExerciseResponse> => {
  const response = await api.get(
    `/modules/${moduleId}/grammar-rule-modules/${grammarRuleId}/exercises/${windowId}`,
  );
  return response.data;
};
