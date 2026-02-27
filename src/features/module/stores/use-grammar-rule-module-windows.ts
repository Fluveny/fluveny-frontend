import type { ExerciseStyle } from '@/features/module/types/exercise';
import type { WindowType } from '@/@types/module';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BuildPhraseExerciseForm } from '../schemas/build-phrase-schema';
import type { FillInTheBlankSchemaForm } from '../schemas/fill-in-the-blanks-schema';
import type { PresentationForm } from '../schemas/presentation-schema';
import type { TranslateExerciseForm } from '../schemas/translate-exercise-schema';
import { createOrderedListActions } from './create-ordered-list-store';

type PresentationWindow = {
  id?: string;
  clientId?: string;
  type: 'PRESENTATION';
  draftData?: Partial<PresentationForm>;
};

type ExerciseWindow = {
  id?: string;
  type: 'EXERCISE';
  style: ExerciseStyle;
  clientId?: string;
  draftData?:
    | Partial<TranslateExerciseForm>
    | Partial<BuildPhraseExerciseForm>
    | Partial<FillInTheBlankSchemaForm>;
};

export type WindowsType = PresentationWindow | ExerciseWindow;

type GrammarRuleModuleWindowsStoreState = {
  windowsList: WindowsType[];
  currentPosition: null | number;
  setWindowsList: (list: WindowsType[]) => void;
  setCurrentPosition: (position: number) => void;
  addWindow: (index: number, window: WindowType, style?: ExerciseStyle) => void;
  moveWindow: (dragIndex: number, hoverIndex: number) => void;
  updateDraftData: (index: number, data: WindowsType['draftData']) => void;
  removeWindow: (indexToRemove: number) => void;
};

export const useGrammarRuleModuleWindows =
  create<GrammarRuleModuleWindowsStoreState>()(
    persist(
      (set) => {
        const orderedListActions = createOrderedListActions<WindowsType>(set, {
          listKey: 'windowsList',
        });

        return {
          windowsList: [],
          currentPosition: null,
          setWindowsList: orderedListActions.setItems,
          setCurrentPosition: (position) => set({ currentPosition: position }),
          addWindow: (index, type, style) => {
            if (type === 'EXERCISE') {
              const newWindow: ExerciseWindow = {
                type: 'EXERCISE',
                style: style || 'TRANSLATE',
                draftData: {},
              };
              orderedListActions.addItem(index, newWindow);
            } else {
              const newWindow: PresentationWindow = {
                type: 'PRESENTATION',
                draftData: {},
              };
              orderedListActions.addItem(index, newWindow);
            }
          },
          moveWindow: orderedListActions.moveItem,
          updateDraftData: orderedListActions.updateDraftData,
          removeWindow: orderedListActions.removeItem,
        };
      },
      {
        name: 'windows-grammar-rule-module',
      },
    ),
  );
