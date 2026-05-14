import type {
  ExerciseRequest,
  ExerciseResponse,
} from '@/features/module/types/exercise';
import { api } from '@/app/libs/api';

interface ModuleTranslateExerciseResponse {
  message: string;
  data: ExerciseResponse;
}

interface updateTranslateExerciseRequest {
  data: ExerciseRequest;
  moduleId: string;
  grammarRuleId: string;
  windowId: string;
}

export const updateGrammarRuleExercise = async ({
  data,
  grammarRuleId,
  moduleId,
  windowId,
}: updateTranslateExerciseRequest) => {
  const response = await api.put<ModuleTranslateExerciseResponse>(
    `/modules/${moduleId}/grammar-rule-modules/${grammarRuleId}/exercises/${windowId}`,
    data,
  );
  return response.data;
};
