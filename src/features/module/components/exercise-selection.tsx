import type { ExerciseStyle } from '@/features/module/types/exercise';
import type { LinguisticAbility, WindowType } from '@/@types/module';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import {
  AudioLines,
  Boxes,
  Eye,
  Languages,
  PencilLine,
  Puzzle,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { SkillToggle } from './exercise-toggle';

const linguisticSkills = [
  {
    id: 'WRITE',
    label: 'Escrita',
    icon: <PencilLine className="size-8" />,
  },
  {
    id: 'LISTEN',
    label: 'Audição',
    icon: <AudioLines className="size-8" />,
  },
  {
    id: 'READ',
    label: 'Leitura',
    icon: <Eye className="size-8" />,
  },
] as const;

const exercisesBySkill: Record<
  LinguisticAbility,
  { icon: ReactNode; title: string; style: ExerciseStyle }[]
> = {
  WRITE: [
    {
      icon: <Boxes className="size-8" />,
      title: 'Construção de frase',
      style: 'ORGANIZE',
    },
    {
      icon: <Languages className="size-8" />,
      title: 'Tradução de frase',
      style: 'TRANSLATE',
    },
    {
      icon: <Puzzle className="size-8" />,
      title: 'Preenchimento de frase',
      style: 'FILL_IN_THE_BLANK',
    },
  ],
  READ: [
    {
      icon: <Boxes className="size-8" />,
      title: 'Interpretação',
      style: 'INTERPRETATION',
    },
    {
      icon: <Languages className="size-8" />,
      title: 'Encontrar sinônimos',
      style: 'FIND_SYNONYMS',
    },
    {
      icon: <Puzzle className="size-8" />,
      title: 'Completar o parágrafo',
      style: 'COMPLETE_PARAGRAPH',
    },
  ],
  LISTEN: [
    {
      icon: <Boxes className="size-8" />,
      title: 'Ditado',
      style: 'DICTATION',
    },
    {
      icon: <Languages className="size-8" />,
      title: 'Transcrição',
      style: 'TRANSCRIPTION',
    },
    {
      icon: <Puzzle className="size-8" />,
      title: 'Identificar palavra',
      style: 'IDENTIFY_WORD',
    },
  ],
};

interface ExerciseSelectorProps {
  children: ReactNode;
  handleAddNewWindow: (type: WindowType, style?: ExerciseStyle) => void;
}

export default function ExerciseSelector({
  handleAddNewWindow,
  children,
}: ExerciseSelectorProps) {
  const [languageSkill, setLanguageSkill] = useState<
    LinguisticAbility | undefined
  >();

  const [exerciseStyle, setExerciseStyle] = useState<
    ExerciseStyle | undefined
  >();
  const [isOpen, setIsOpen] = useState(false);

  function handleSkillToggle(ability: LinguisticAbility) {
    setLanguageSkill((current) => (current === ability ? undefined : ability));
    setExerciseStyle(undefined);
  }

  function handleExerciseToggle(style: ExerciseStyle) {
    setExerciseStyle(style);
  }

  function handleConfirm() {
    if (languageSkill && exerciseStyle) {
      handleAddNewWindow('EXERCISE', exerciseStyle);
    }
  }

  function resetSelection() {
    setLanguageSkill(undefined);
    setExerciseStyle(undefined);
  }

  function handleOpenChange(open: boolean) {
    setIsOpen(open);
    if (!open) {
      resetSelection();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="hidden">
          <DialogTitle>Selecione o tipo do exercício</DialogTitle>
          <DialogDescription>
            Escolha uma habilidade para praticar e, em seguida, um estilo de
            exercício correspondente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 pt-4">
          <section className="flex w-full flex-col items-center">
            <h3 className="mb-4 text-lg font-semibold">
              Habilidade Linguística
            </h3>
            <div className="flex h-full w-full justify-around">
              {linguisticSkills.map((skill) => (
                <SkillToggle
                  key={skill.id}
                  onClick={() =>
                    handleSkillToggle(skill.id as LinguisticAbility)
                  }
                  isPressed={languageSkill === skill.id}
                  icon={skill.icon}
                  label={skill.label}
                />
              ))}
            </div>
          </section>

          {languageSkill && (
            <section className="flex w-full flex-col items-center">
              <h3 className="mb-4 text-lg font-semibold">
                Estilo de Exercício
              </h3>
              <div className="flex h-full w-full justify-around">
                {exercisesBySkill[languageSkill].map((exercise) => (
                  <SkillToggle
                    key={exercise.style}
                    onClick={() => handleExerciseToggle(exercise.style)}
                    isPressed={exerciseStyle === exercise.style}
                    icon={exercise.icon}
                    label={exercise.title}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="text-md cursor-pointer"
              onClick={handleConfirm}
              disabled={!languageSkill || !exerciseStyle}
            >
              Confirmar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
