import { publishModule } from '@/features/module/services/mutations/publish-module';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const usePublishModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creator-modules'] });
      toast.success('Módulo publicado com sucesso!');
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        'Erro ao publicar o módulo. Verifique se todas as seções (Introdução, Regras Gramaticais e Desafio Final) estão preenchidas.';
      toast.error(message);
    },
  });
};
