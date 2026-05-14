import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, X } from 'lucide-react';
import { useEffect, useState, type KeyboardEvent } from 'react';

interface DistractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  onDelete?: () => void;
  initialData: {
    index: number | null;
    value: string;
  };
  distractorsCount: number;
}

export const DistractorModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
  distractorsCount,
}: DistractorModalProps) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Defer state update to avoid synchronous setState in effect
      setTimeout(() => setValue(initialData.value), 0);
    }
  }, [isOpen, initialData.value]);

  if (!isOpen) {
    return null;
  }

  const isCreating = initialData.index === null;
  const title = isCreating
    ? `Distração ${distractorsCount + 1}`
    : `Distração ${(initialData.index ?? 0) + 1}`;

  const handleSaveClick = () => {
    if (value.trim() === '') return;
    onSave(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex justify-between">
          <h3 className="mb-4 text-xl font-semibold">{title}</h3>
          <Button
            className="bg-transparent text-black hover:bg-zinc-200"
            onClick={onClose}
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
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="py-6 text-lg"
            placeholder="Digite a distração..."
            autoFocus
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="mt-6 flex justify-end gap-5">
          {onDelete && (
            <button className="bg- flex items-center" onClick={onDelete}>
              <Trash2 className="cursor-pointer text-zinc-400 hover:text-red-400" />
            </button>
          )}
          <Button type="button" onClick={handleSaveClick} size="lg">
            {isCreating ? 'Criar' : 'Editar'}
          </Button>
        </div>
      </div>
    </div>
  );
};
