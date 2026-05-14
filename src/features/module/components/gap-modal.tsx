import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState, type KeyboardEvent } from 'react';
import { toast } from 'sonner';

interface GapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { words: string[]; justification: string }) => void;
  onDelete?: () => void;
  initialData: {
    words: string[];
    justification: string;
  };
}

export const GapModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialData,
}: GapModalProps) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState('');
  const [justification, setJustification] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Defer state updates to avoid synchronous setState in effect
      setTimeout(() => {
        setWords(initialData?.words ?? []);
        setJustification(initialData?.justification ?? '');
        setCurrentWord('');
      }, 0);
    }
  }, [isOpen, initialData]);

  if (!isOpen) {
    return null;
  }

  const handleAddWord = () => {
    const trimmedWord = currentWord.trim();
    if (trimmedWord && !words.includes(trimmedWord)) {
      setWords([...words, trimmedWord]);
      setCurrentWord('');
    }
  };

  const handleRemoveWord = (indexToRemove: number) => {
    setWords(words.filter((_, index) => index !== indexToRemove));
  };

  const handleWordInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddWord();
    }
  };

  const handleSaveClick = () => {
    let finalWords = [...words];
    const trimmedWord = currentWord.trim();

    if (trimmedWord && !finalWords.includes(trimmedWord)) {
      finalWords.push(trimmedWord);
    }

    if (finalWords.length === 0) {
      toast.error('Adicione pelo menos uma palavra!');
      return;
    }

    onSave({
      words: finalWords,
      justification: justification.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Lacuna</h3>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gap-words" className="text-base">
              Palavras de Resposta
            </Label>
            <div className="flex gap-2">
              <Input
                id="gap-words"
                value={currentWord}
                onChange={(e) => setCurrentWord(e.target.value)}
                className="py-6 text-lg"
                onKeyDown={handleWordInputKeyDown}
              />
              <Button type="button" className="py-6" onClick={handleAddWord}>
                <Plus />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {words.map((word, index) => (
                <span
                  key={index}
                  className="text-md flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800"
                >
                  {word}
                  <button
                    type="button"
                    onClick={() => handleRemoveWord(index)}
                    className="cursor-pointer rounded-full text-blue-600"
                  >
                    <X className="h-3.5 w-3.5 hover:text-red-400" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gap-justification" className="text-base">
              Justificativa
            </Label>
            <Textarea
              id="gap-justification"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="min-h-[100px] text-lg"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <div>
            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button type="button" onClick={handleSaveClick} size="lg">
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};
