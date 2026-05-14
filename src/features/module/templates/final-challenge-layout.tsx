import { DndProvider } from '@/app/providers/dnd-provider';
import { DraftWindowsModal } from '@/components/modal';
import { NotFound } from '@/templates/not-found';
import { useEffect } from 'react';
import { Outlet, useBlocker, useNavigate, useParams } from 'react-router';
import FormExercisePageSkeleton from '../components/exercise-page-skeleton';
import { FinalChallengeContentWindow } from '../components/final-challenge-window-list';
import { useUpdateFinalChallengeExercisesChallenge } from '../hooks/api/mutations/use-update-final-challenge-exercises';
import { useGetFinalChallengeExercises } from '../hooks/api/queries/use-get-final-challenge-exercises';
import {
  useFinalChallengeExercise,
  type Exercise,
} from '../stores/use-final-challenge-exercises';

export const FinalChallengeLayout = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams();

  const { data: exercises, isLoading: isLoadingExercises } =
    useGetFinalChallengeExercises(moduleId);

  const updateExercisesMutation = useUpdateFinalChallengeExercisesChallenge();

  const exerciseList = useFinalChallengeExercise((state) => state.exerciseList);
  const setExerciseList = useFinalChallengeExercise(
    (state) => state.setExerciseList,
  );
  const currentPosition = useFinalChallengeExercise(
    (state) => state.currentPosition,
  );
  const setCurrentPosition = useFinalChallengeExercise(
    (state) => state.setCurrentPosition,
  );

  const hasDraftExercises = exerciseList.some((e) => !e.id);

  const blocker = useBlocker(({ nextLocation }) => {
    if (!moduleId) return false;

    const finalChallengeBasePath = `/modules/create/${moduleId}/finalChallenge`;
    const isNavigatingWithinEditor = nextLocation.pathname.startsWith(
      finalChallengeBasePath,
    );

    return !isNavigatingWithinEditor;
  });

  const onSendExercisesPosition = (data: Exercise[]) => {
    if (!moduleId) return;

    const exerciseIds = data.filter((w) => w.id).map(({ id }) => id as string);

    if (exerciseIds.length > 0) {
      updateExercisesMutation.mutate({ moduleId, data: exerciseIds });
    }
  };

  useEffect(() => {
    if (blocker.state === 'blocked' && !hasDraftExercises) {
      onSendExercisesPosition(exerciseList);
      blocker.proceed();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker, hasDraftExercises, exerciseList]);

  const handleConfirmNavigation = () => {
    if (blocker.state === 'blocked') {
      const exercisesToSave = exerciseList.filter((e) => e.id);
      onSendExercisesPosition(exercisesToSave);
      blocker.proceed();
    }
  };

  const handleCancelNavigation = () => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  };

  const currentExercise =
    currentPosition !== null ? exerciseList[currentPosition] : null;
  const uniqueKey = currentExercise?.id ?? currentExercise?.clientId;

  useEffect(() => {
    if (exercises) {
      const exercisesWithClientId = exercises.map(
        (e) =>
          ({
            ...e,
            clientId: e.id,
          }) as Exercise,
      );

      if (exercisesWithClientId.length > 0) {
        setExerciseList(exercisesWithClientId);
        setCurrentPosition(0);
        navigate(`${exercises[0].style.toLowerCase()}/${exercises[0].id}`, {
          replace: true,
        });
      } else {
        setExerciseList([
          {
            type: 'EXERCISE',
            clientId: crypto.randomUUID(),
            style: 'TRANSLATE',
          },
        ]);
        setCurrentPosition(0);
      }
    } else if (!isLoadingExercises) {
      setExerciseList([
        { type: 'EXERCISE', clientId: crypto.randomUUID(), style: 'TRANSLATE' },
      ]);
      setCurrentPosition(0);
    }
  }, [
    isLoadingExercises,
    navigate,
    setExerciseList,
    setCurrentPosition,
    exercises,
  ]);

  useEffect(() => {
    if (
      currentPosition !== null &&
      exerciseList.length > 0 &&
      exerciseList[currentPosition]
    ) {
      const currentExercise = exerciseList[currentPosition];

      const pathSegments = [];

      if (currentExercise.style) {
        pathSegments.push(currentExercise.style.toLowerCase());
      }

      if (currentExercise.id) {
        pathSegments.push(currentExercise.id);
      }

      const path = pathSegments.join('/');

      if (path) {
        navigate(path, { replace: true });
      }
    }
  }, [currentPosition, exerciseList, navigate]);

  if (isLoadingExercises) {
    return <FormExercisePageSkeleton />;
  }

  if (!moduleId) {
    return <NotFound />;
  }

  return (
    <DndProvider key={`${moduleId}-finalChallenge`}>
      <div>
        <Outlet key={uniqueKey} />
        <FinalChallengeContentWindow />
        <DraftWindowsModal
          key={'final-challenge'}
          isOpen={blocker.state === 'blocked' && hasDraftExercises}
          onCancel={handleCancelNavigation}
          onConfirm={handleConfirmNavigation}
          windowsList={exerciseList}
        />
      </div>
    </DndProvider>
  );
};
