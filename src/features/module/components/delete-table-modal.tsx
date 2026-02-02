import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';

interface DeleteTableModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteTableModal({
  isOpen,
  onCancel,
  onConfirm,
}: DeleteTableModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader className="items-start">
          <DialogTitle>Excluir Tabela</DialogTitle>
          <DialogDescription>
            Isso vai apagar a tabela inteira e todo o seu conteúdo. Deseja
            continuar?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex">
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={onConfirm}
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
