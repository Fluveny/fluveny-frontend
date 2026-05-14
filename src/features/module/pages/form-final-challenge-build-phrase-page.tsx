import { cn } from '@/app/utils/cn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NotFound } from '@/templates/not-found';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { Distration } from '../components/distration';
import FormExercisePageSkeleton from '../components/exercise-page-skeleton';
import { FormSectionWrapper } from '../components/form-section-wrapper';
import { ModuleHeader } from '../components/module-header';
import { useCreateFinalChallengeExercise } from '../hooks/api/mutations/use-create-final-challenge-exercise';
import { useUpdateFinalChallengeExercise } from '../hooks/api/mutations/use-update-final-challenge-exercise';
import { useGetFinalChallengeExercise } from '../hooks/api/queries/use-get-final-challenge-exercise';
import {
  BuildPhraseExerciseSchema,
  type BuildPhraseExerciseForm,
} from '../schemas/build-phrase-schema';
import { useFinalChallengeExercise } from '../stores/use-final-challenge-exercises';

export const FormFinalChallengeBuildPhrasePage = () => {
  const { moduleId, exerciseId } = useParams();

  const { exerciseList, setExerciseList, currentPosition, updateDraftData } =
    useFinalChallengeExercise();

  const methods = useForm<BuildPhraseExerciseForm>({
    resolver: zodResolver(BuildPhraseExerciseSchema),
    defaultValues: {
      translation: '',
      originalSentence: '',
      distractors: [],
    },
  });

  const { data: buildPhraseExerciseContent, isLoading } =
    useGetFinalChallengeExercise({
      moduleId,
      exerciseId,
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

  const isEditMode = !!exerciseId;

  const currentWindow =
    currentPosition !== null ? exerciseList[currentPosition] : undefined;
  const draftData =
    currentWindow?.type === 'EXERCISE'
      ? (currentWindow.draftData as Partial<BuildPhraseExerciseForm>)
      : undefined;

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

  const handleSaveDraftOnBlur = () => {
    if (!isEditMode && currentPosition !== null) {
      const currentValues = methods.getValues();
      updateDraftData(currentPosition, currentValues);
    }
  };

  const updateBuildPhraseExercise = useUpdateFinalChallengeExercise();
  const createBuildPhraseExercise = useCreateFinalChallengeExercise();

  if (isLoading) {
    return <FormExercisePageSkeleton />;
  }

  if (!moduleId) {
    return <NotFound />;
  }

  const onSubmit = (formData: BuildPhraseExerciseForm) => {
    const dataWithStyle = {
      ...formData,
      style: 'ORGANIZE',
    };
    if (isEditMode) {
      updateBuildPhraseExercise.mutate(
        {
          moduleId,
          exerciseId,
          data: dataWithStyle,
        },
        {
          onSuccess: () => toast.success('Exercício atualizado com sucesso'),
        },
      );
    } else {
      createBuildPhraseExercise.mutate(
        {
          moduleId,
          data: dataWithStyle,
        },
        {
          onSuccess: (newlyCreatedWindow) => {
            if (currentPosition === null) return;
            const newList = [...exerciseList];
            const clientId = newList[currentPosition]?.clientId;
            newList[currentPosition] = {
              id: newlyCreatedWindow.id,
              type: 'EXERCISE',
              clientId,
              style: 'ORGANIZE',
              draftData: {},
            };
            setExerciseList(newList);
            toast.success('Exercício criado com sucesso');
          },
        },
      );
    }
  };

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

  const handleSaveDistractor = () => {
    if (modalState.value.trim() === '') return;

    const currentDistractors = methods.getValues('distractors') || [];

    if (modalState.index === null) {
      methods.setValue('distractors', [
        ...currentDistractors,
        modalState.value,
      ]);
    } else {
      const newList = [...currentDistractors];
      newList[modalState.index] = modalState.value;
      methods.setValue('distractors', newList);
    }
    handleCloseModal();
  };

  return (
    <>
      <ModuleHeader step={'Exercício de Preenchimento de frase'} />
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

      {modalState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex justify-between">
              <h3 className="mb-4 text-xl font-semibold">
                {modalState.index === null
                  ? `Distração ${distractors.length + 1}`
                  : `Distração ${modalState.index + 1}`}
              </h3>
              <Button
                className="bg-transparent text-black hover:bg-zinc-200"
                onClick={handleCloseModal}
              >
                <X />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distractor-word" className="text-base">
                Palavra
              </Label>
              <Input
                id="distractor-word"
                value={modalState.value}
                onChange={(e) =>
                  setModalState((prev) => ({ ...prev, value: e.target.value }))
                }
                className="py-6 text-lg"
                placeholder="Digite a distração..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveDistractor();
                  }
                }}
              />
            </div>

            <div className="mt-6 flex justify-end gap-5">
              {modalState.index !== null && (
                <button
                  className="bg- flex items-center"
                  onClick={() => handleRemoveDistractor(modalState.index)}
                >
                  <Trash2 className="cursor-pointer text-zinc-400 hover:text-red-400" />
                </button>
              )}
              <Button type="button" onClick={handleSaveDistractor} size="lg">
                {modalState.index === null ? 'Criar' : 'Editar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
