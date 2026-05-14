import type { ExerciseRequest } from '@/features/module/types/exercise';
import { createGrammarRuleExercise } from '@/features/module/services/mutation/create-grammar-rule-exercise';
import { useMutation } from '@tanstack/react-query';

interface createGrammarRuleExerciseRequest {
  data: ExerciseRequest;
  moduleId: string;
  grammarRuleId: string;
}

export function useCreateGrammarRuleExercise() {
  return useMutation({
    mutationFn: async ({
      data,
      moduleId,
      grammarRuleId,
    }: createGrammarRuleExerciseRequest) => {
      const response = await createGrammarRuleExercise({
        data,
        moduleId,
        grammarRuleId,
      });

      return response.data;
    },
  });
}
