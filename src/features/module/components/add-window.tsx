import type { ExerciseStyle } from '@/features/module/types/exercise';
import type { WindowType } from '@/@types/module';
import { cn } from '@/app/utils/cn';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useFinalChallengeExercise } from '../stores/use-final-challenge-exercises';
import { useGrammarRuleModuleWindows } from '../stores/use-grammar-rule-module-windows';
import ExerciseSelector from './exercise-selection';

interface AddWindowProps {
  side: 'left' | 'right';
  insertionIndex: number;
  isPresentationEnabled: boolean;
}

export const AddWindow = ({
  side,
  insertionIndex,
  isPresentationEnabled,
}: AddWindowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const addWindowGrammarRule = useGrammarRuleModuleWindows(
    (state) => state.addWindow,
  );
  const addFinalChallengeExercise = useFinalChallengeExercise(
    (state) => state.addExercise,
  );

  const handleSelectWindowType = (type: WindowType, style?: ExerciseStyle) => {
    if (isPresentationEnabled) {
      if (type === 'EXERCISE') {
        addWindowGrammarRule(insertionIndex, type, style);
      } else {
        addWindowGrammarRule(insertionIndex, type);
      }
    } else if (style) {
      addFinalChallengeExercise(insertionIndex, style);
    }

    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 group-hover:flex data-[state=open]:flex',
            'hidden size-6 hover:bg-blue-800 data-[state=open]:bg-blue-800 md:hidden lg:size-8',
            side === 'left' ? '-left-4 lg:-left-6' : '-right-4 lg:-right-6',
          )}
        >
          <Plus className={cn('relative', side === 'left' && '-rotate-90')} />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" asChild className="w-40 p-0 lg:w-50">
        <div className="border-primary flex flex-col rounded-md border-1">
          {isPresentationEnabled && (
            <Button
              onClick={() => handleSelectWindowType('PRESENTATION')}
              variant={'ghost'}
              className="border-primary cursor-pointer rounded-t-md rounded-b-none border-b-1 lg:py-5 lg:text-base"
            >
              Apresentação
            </Button>
          )}
          <ExerciseSelector handleAddNewWindow={handleSelectWindowType}>
            <Button
              variant={'ghost'}
              className="cursor-pointer rounded-b-md bg-white text-zinc-900 lg:py-5 lg:text-base"
            >
              Exercício
            </Button>
          </ExerciseSelector>
        </div>
      </PopoverContent>
    </Popover>
  );
};
