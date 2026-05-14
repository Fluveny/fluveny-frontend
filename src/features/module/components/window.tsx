import type { WindowType } from '@/@types/module';
import { cn } from '@/app/utils/cn';
import type { Identifier, XYCoord } from 'dnd-core';
import { BowArrow, Presentation, Trash2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { DragPreviewImage, useDrag, useDrop } from 'react-dnd';
import { AddWindow } from './add-window';

interface WindowProps {
  id: string | undefined;
  isCurrent?: boolean;
  position: number;
  selectWindow: () => void;
  isPresentationEnabled: boolean;
  isDraft: boolean;
  type: WindowType;
  moveWindow: (dragIndex: number, hoverIndex: number) => void;
  handleDeleteWindow: (contentId: string | undefined, isDraft: boolean) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: WindowType;
}

const DND_ITEM_TYPE = 'WINDOW';

const transparentImage =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export const Window = ({
  id,
  isCurrent = false,
  position,
  isDraft,
  isPresentationEnabled,
  type,
  selectWindow,
  moveWindow,
  handleDeleteWindow,
}: WindowProps) => {
  const ref = useRef<HTMLLIElement>(null);
  const index = position - 1;

  const [{ handlerId, isOver }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null; isOver: boolean }
  >({
    accept: DND_ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      moveWindow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: DND_ITEM_TYPE,
    item: () => ({ id, index, type }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Connect drag source and drop target after refs are set
  useEffect(() => {
    drag(drop(ref));
  }, [drag, drop]);

  return (
    <>
      <DragPreviewImage connect={dragPreview} src={transparentImage} />
      <div
        className={cn(
          'group relative flex items-center justify-center transition-all duration-300 ease-in-out',
          isCurrent && 'mx-8 scale-110',
          !isCurrent && 'hover:mx-4',
        )}
      >
        {!isDragging && (
          <AddWindow
            side="left"
            insertionIndex={position - 1}
            isPresentationEnabled={isPresentationEnabled}
          />
        )}

        <li
          onClick={selectWindow}
          data-handler-id={handlerId}
          className={cn(
            'h-18 w-30 flex-shrink-0 cursor-grab rounded-md border-2 p-2 transition-all lg:h-24 lg:w-50',
            isCurrent && 'border-primary',
            isDragging && 'opacity-20',
            isOver && 'ring-primary/50 ring-2',
          )}
          ref={ref}
        >
          {type === 'PRESENTATION' && (
            <Presentation
              className={cn(isCurrent ? 'text-primary' : 'text-zinc-400')}
            />
          )}
          {type === 'EXERCISE' && (
            <BowArrow
              className={cn(isCurrent ? 'text-primary' : 'text-zinc-400')}
            />
          )}
          {isDraft && (
            <span className="absolute top-2 right-3 text-zinc-400">*</span>
          )}
          <span className="absolute bottom-0 left-2 lg:text-lg">
            {position}
          </span>
          {isCurrent && (
            <button
              className="absolute right-3 bottom-2 cursor-pointer text-zinc-400 hover:text-red-400"
              onClick={() => handleDeleteWindow(id, isDraft)}
            >
              <Trash2 />
            </button>
          )}
        </li>

        {!isDragging && (
          <AddWindow
            side="right"
            insertionIndex={position}
            isPresentationEnabled={isPresentationEnabled}
          />
        )}
      </div>
    </>
  );
};
