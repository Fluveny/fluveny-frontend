import type {
  ExerciseRequest,
  ExerciseResponse,
} from '@/features/module/types/exercise';
import { api } from '@/app/libs/api';

interface ModuleExerciseResponse {
  message: string;
  data: ExerciseResponse;
}

interface createExerciseRequest {
  data: ExerciseRequest;
  moduleId: string;
  grammarRuleId: string;
}

export const createGrammarRuleExercise = async ({
  data,
  grammarRuleId,
  moduleId,
}: createExerciseRequest) => {
  const response = await api.post<ModuleExerciseResponse>(
    `/modules/${moduleId}/grammar-rule-modules/${grammarRuleId}/exercises`,
    data,
  );
  return response.data;
};
