import type { ExerciseStyle } from '@/features/module/types/exercise';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BuildPhraseExerciseForm } from '../schemas/build-phrase-schema';
import type { FillInTheBlankSchemaForm } from '../schemas/fill-in-the-blanks-schema';
import type { TranslateExerciseForm } from '../schemas/translate-exercise-schema';
import { createOrderedListActions } from './create-ordered-list-store';

export type Exercise = {
  id?: string;
  clientId?: string;
  type: 'EXERCISE';
  style: ExerciseStyle;
  draftData?:
    | Partial<TranslateExerciseForm>
    | Partial<BuildPhraseExerciseForm>
    | Partial<FillInTheBlankSchemaForm>;
};

type FinalChallengeExerciseStoreState = {
  exerciseList: Exercise[];
  currentPosition: null | number;
  setExerciseList: (list: Exercise[]) => void;
  setCurrentPosition: (position: number) => void;
  addExercise: (index: number, style: ExerciseStyle) => void;
  moveExercise: (dragIndex: number, hoverIndex: number) => void;
  updateDraftData: (index: number, data: Exercise['draftData']) => void;
  removeExercise: (indexToRemove: number) => void;
};

export const useFinalChallengeExercise =
  create<FinalChallengeExerciseStoreState>()(
    persist(
      (set) => {
        const orderedListActions = createOrderedListActions<Exercise>(set, {
          listKey: 'exerciseList',
        });

        return {
          exerciseList: [],
          currentPosition: null,
          setExerciseList: orderedListActions.setItems,
          setCurrentPosition: (position) => set({ currentPosition: position }),
          addExercise: (index, style) => {
            const newExercise: Omit<Exercise, 'clientId'> = {
              type: 'EXERCISE',
              style,
              draftData: {},
            };
            orderedListActions.addItem(index, newExercise);
          },
          moveExercise: orderedListActions.moveItem,
          updateDraftData: orderedListActions.updateDraftData,
          removeExercise: orderedListActions.removeItem,
        };
      },
      {
        name: 'exercises-final-challenge',
      },
    ),
  );
