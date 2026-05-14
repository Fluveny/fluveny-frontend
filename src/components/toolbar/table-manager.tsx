import { useCurrentEditor } from '@tiptap/react';
import {
  BetweenHorizonalEnd,
  BetweenHorizonalStart,
  BetweenVerticalEnd,
  BetweenVerticalStart,
  Grid2X2,
  Grid2X2Plus,
  Grid2X2X,
  LayoutPanelLeft,
  LayoutPanelTop,
  type LucideIcon,
  Table,
  Table2,
  TableCellsMerge,
  TableCellsSplit,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import PopoverToolbar from './popover-toolbar';
import { DeleteTableModal } from '@/features/module/components/delete-table-modal.tsx';

interface ToolbarButtonProps {
  title: string;
  onClick: () => void;
  icon: LucideIcon;
  active: boolean;
}

function ToolbarButton({
  title,
  onClick,
  icon: Icon,
  active,
}: ToolbarButtonProps) {
  const variant = active ? 'default' : 'ghost';
  return (
    <Button variant={variant} title={title} onClick={onClick} type="button">
      <Icon className="size-5" />
    </Button>
  );
}

export default function TableManager() {
  const { editor } = useCurrentEditor();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!editor) return null;

  const handleTableClick = () => {
    if (editor.isActive('table')) {
      setIsDeleteModalOpen(true);
    } else {
      editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
    }
  };

  const confirmDeleteTable = () => {
    editor.chain().focus().deleteTable().run();
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <DeleteTableModal
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteTable}
      />

      <div className="rounded-md">
        <ToolbarButton
          title={editor.isActive('table') ? 'Apagar Tabela' : 'Criar Tabela'}
          onClick={handleTableClick}
          icon={Table}
          active={editor.isActive('table')}
        />
        <PopoverToolbar trigger={<Grid2X2Plus className="size-5" />}>
          <ToolbarButton
            title="Adicionar Linha"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            icon={BetweenHorizonalStart}
            active={false}
          />
          <ToolbarButton
            title="Adicionar Coluna"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            icon={BetweenVerticalStart}
            active={false}
          />
        </PopoverToolbar>
        <PopoverToolbar trigger={<Grid2X2X className="size-5" />}>
          <ToolbarButton
            title="Remover Linha"
            onClick={() => editor.chain().focus().deleteRow().run()}
            icon={BetweenHorizonalEnd}
            active={false}
          />
          <ToolbarButton
            title="Remover Coluna"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            icon={BetweenVerticalEnd}
            active={false}
          />
        </PopoverToolbar>
        <PopoverToolbar trigger={<Table2 className="size-5" />}>
          <ToolbarButton
            title="Alterar Cabeçalho de Linha"
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
            icon={LayoutPanelTop}
            active={false}
          />
          <ToolbarButton
            title="Alterar Cabeçalho de Coluna"
            onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
            icon={LayoutPanelLeft}
            active={false}
          />
          <ToolbarButton
            title="Alterar Cabeçalho de Célula"
            onClick={() => editor.chain().focus().toggleHeaderCell().run()}
            icon={Grid2X2}
            active={false}
          />
        </PopoverToolbar>
        <Button
          title={
            editor.can().splitCell() ? 'Separar Células' : 'Mesclar Células'
          }
          variant={editor.can().mergeOrSplit() ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().mergeOrSplit().run()}
          type="button"
        >
          {editor.can().mergeCells() ? (
            <TableCellsMerge className="size-5" />
          ) : (
            <TableCellsSplit className="size-5" />
          )}
        </Button>
      </div>
    </>
  );
}
