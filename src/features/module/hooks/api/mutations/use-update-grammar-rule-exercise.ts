import type { ExerciseRequest } from '@/features/module/types/exercise';
import { updateGrammarRuleExercise } from '@/features/module/services/mutation/update-grammar-rule-exercise';
import { useMutation } from '@tanstack/react-query';

interface updateExerciseRequest {
  data: ExerciseRequest;
  moduleId: string;
  grammarRuleId: string;
  windowId: string;
}

export function useUpdateGrammarRuleExercise() {
  return useMutation({
    mutationFn: async ({
      data,
      moduleId,
      grammarRuleId,
      windowId,
    }: updateExerciseRequest) => {
      const response = await updateGrammarRuleExercise({
        data,
        moduleId,
        grammarRuleId,
        windowId,
      });
      return response.data;
    },
  });
}
