import { cn } from '@/app/utils/cn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NotFound } from '@/templates/not-found';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { DistractorModal } from '../components/distractor-modal';
import { Distration } from '../components/distration';
import FormExercisePageSkeleton from '../components/exercise-page-skeleton';
import { FormSectionWrapper } from '../components/form-section-wrapper';
import { ModuleHeader } from '../components/module-header';
import { useCreateGrammarRuleExercise } from '../hooks/api/mutations/use-create-grammar-rule-exercise';
import { useUpdateGrammarRuleExercise } from '../hooks/api/mutations/use-update-grammar-rule-exercise';
import { useGetExercise } from '../hooks/api/queries/use-get-exercise';
import {
  BuildPhraseExerciseSchema,
  type BuildPhraseExerciseForm,
} from '../schemas/build-phrase-schema';
import { useGrammarRuleModuleWindows } from '../stores/use-grammar-rule-module-windows';

export const FormGrammarRuleBuildPhrasePage = () => {
  const { windowId, moduleId, grammarRuleId } = useParams();
  const { windowsList, currentPosition, setWindowsList, updateDraftData } =
    useGrammarRuleModuleWindows();

  const isEditMode = !!windowId;

  const currentWindow =
    currentPosition !== null ? windowsList[currentPosition] : undefined;
  const draftData =
    currentWindow?.type === 'EXERCISE'
      ? (currentWindow.draftData as Partial<BuildPhraseExerciseForm>)
      : undefined;

  const methods = useForm<BuildPhraseExerciseForm>({
    resolver: zodResolver(BuildPhraseExerciseSchema),
    defaultValues: {
      translation: '',
      originalSentence: '',
      distractors: [],
    },
  });

  const distractors =
    useWatch({
      control: methods.control,
      name: 'distractors',
    }) || [];

  const [modalState, setModalState] = useState<{
    open: boolean;
    index: number | null;
    value: string;
  }>({
    open: false,
    index: null,
    value: '',
  });

  const { data: buildPhraseExerciseContent, isLoading } = useGetExercise({
    moduleId,
    grammarRuleId,
    windowId,
  });

  useEffect(() => {
    if (isEditMode && buildPhraseExerciseContent) {
      methods.reset(buildPhraseExerciseContent as BuildPhraseExerciseForm);
    } else if (!isEditMode && draftData) {
      methods.reset({
        translation: draftData.translation || '',
        originalSentence: draftData.originalSentence || '',
        distractors: draftData.distractors || [],
      });
    }
  }, [buildPhraseExerciseContent, isEditMode, methods, draftData]);

  const updateBuildPhraseExercise = useUpdateGrammarRuleExercise();
  const createBuildPhraseExercise = useCreateGrammarRuleExercise();

  const handleSaveDraftOnBlur = () => {
    if (!isEditMode && currentPosition !== null) {
      const currentValues = methods.getValues();
      updateDraftData(currentPosition, currentValues);
    }
  };

  if (!moduleId || !grammarRuleId) {
    return <NotFound />;
  }

  const handleOpenNewDistractorModal = () => {
    setModalState({ open: true, index: null, value: '' });
  };

  const handleRemoveDistractor = (index: number | null) => {
    const currentDistractors = methods.getValues('distractors') || [];
    methods.setValue(
      'distractors',
      currentDistractors.filter((_, i) => i !== index),
    );
    handleCloseModal();
  };

  const handleOpenEditDistractorModal = (index: number) => {
    setModalState({
      open: true,
      index: index,
      value: methods.getValues(`distractors.${index}`),
    });
  };

  const handleCloseModal = () => {
    setModalState({ open: false, index: null, value: '' });
  };

  const handleSaveDistractor = (value: string) => {
    if (value.trim() === '') return;

    const currentDistractors = methods.getValues('distractors') || [];

    if (modalState.index === null) {
      methods.setValue('distractors', [...currentDistractors, value]);
    } else {
      const newList = [...currentDistractors];
      newList[modalState.index] = value;
      methods.setValue('distractors', newList);
    }
    handleCloseModal();
  };

  const onSubmit = (formData: BuildPhraseExerciseForm) => {
    const dataWithStyle = {
      ...formData,
      style: 'ORGANIZE',
    };

    if (isEditMode) {
      updateBuildPhraseExercise.mutate(
        {
          moduleId,
          grammarRuleId,
          windowId,
          data: dataWithStyle,
        },
        {
          onSuccess: () => toast.success('Exercício editado com sucesso'),
        },
      );
    } else {
      createBuildPhraseExercise.mutate(
        {
          moduleId,
          grammarRuleId,
          data: dataWithStyle,
        },
        {
          onSuccess: (newlyCreatedWindow) => {
            if (currentPosition === null) return;
            const newList = [...windowsList];

            const clientId = newList[currentPosition]?.clientId;

            newList[currentPosition] = {
              id: newlyCreatedWindow.id,
              type: 'EXERCISE',
              style: 'ORGANIZE',
              clientId,
              draftData: {},
            };

            setWindowsList(newList);

            toast.success('Exercício editado com sucesso');
          },
        },
      );
    }
  };

  if (isLoading) {
    return <FormExercisePageSkeleton />;
  }

  return (
    <>
      <ModuleHeader step={'Exercício de Construção de frase'} />
      <div className="mx-auto mb-30 flex w-full max-w-300 flex-col px-4 pb-8">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormSectionWrapper label="Frase original">
              <Input
                {...methods.register('originalSentence')}
                onBlur={handleSaveDraftOnBlur}
                className={cn(
                  'py-6 lg:text-lg',
                  methods.formState.errors.originalSentence &&
                    'animate-shake border-red-500 text-red-500',
                )}
                placeholder="Escreva aqui..."
              />
              {methods.formState.errors.originalSentence && (
                <p className="mt-1 text-sm text-red-500">
                  {methods.formState.errors.originalSentence.message as string}
                </p>
              )}
            </FormSectionWrapper>
            <FormSectionWrapper className="mb-6 lg:mb-8" label="Resposta">
              <Input
                {...methods.register('translation')}
                onBlur={handleSaveDraftOnBlur}
                className={cn(
                  'py-6 lg:text-lg',
                  methods.formState.errors.translation &&
                    'animate-shake border-red-500 text-red-500',
                )}
                placeholder="Escreva aqui..."
              />
              {methods.formState.errors.translation && (
                <p className="mt-1 text-sm text-red-500">
                  {methods.formState.errors.translation.message as string}
                </p>
              )}
            </FormSectionWrapper>
            <div>
              <div className="flex justify-between">
                <Label className="mb-6 block text-xl font-medium lg:mb-8">
                  Distrações
                </Label>
                <Button
                  className="group rounded-full border bg-transparent py-5"
                  type="button"
                  onClick={handleOpenNewDistractorModal}
                >
                  <Plus className="text-primary size-5 group-hover:text-white" />
                </Button>
              </div>

              <ul className="grid grid-cols-3 justify-center gap-4 rounded-md border px-10 py-5 md:grid-cols-5 lg:grid-cols-6">
                {distractors.map((distraction, index) => (
                  <Distration
                    key={index}
                    index={index}
                    distration={distraction}
                    onClick={() => handleOpenEditDistractorModal(index)}
                    className="cursor-pointer"
                  />
                ))}
              </ul>
            </div>

            <Button
              disabled={
                createBuildPhraseExercise.isPending ||
                updateBuildPhraseExercise.isPending
              }
              type="submit"
              className="mt-8 mb-24 w-full cursor-pointer py-8 text-xl font-bold"
              size="xl"
            >
              <span>{isEditMode ? 'Editar' : 'Criar'}</span>
            </Button>
          </form>
        </FormProvider>
      </div>

      <DistractorModal
        isOpen={modalState.open}
        onClose={handleCloseModal}
        onSave={handleSaveDistractor}
        onDelete={
          modalState.index !== null
            ? () => handleRemoveDistractor(modalState.index)
            : undefined
        }
        initialData={{
          index: modalState.index,
          value: modalState.value,
        }}
        distractorsCount={distractors.length}
      />
    </>
  );
};
