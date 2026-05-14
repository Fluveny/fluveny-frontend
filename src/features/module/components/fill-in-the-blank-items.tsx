import type { PhraseElement } from '@/features/module/schemas/fill-in-the-blanks-schema';
import type { Identifier } from 'dnd-core';
import { useEffect, useRef, type ChangeEvent, type FocusEvent } from 'react';
import { DragPreviewImage, useDrag, useDrop, type XYCoord } from 'react-dnd';
import { Input } from '../../../components/ui/input';

const DND_ITEM_TYPE = 'PHRASE_ELEMENT';

interface DragItem {
  index: number;
  id: string;
  type: 'TEXT' | 'GAP';
}

const transparentImage =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

interface DraggableItemProps {
  item: PhraseElement;
  index: number;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  handleTextChange: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
  handleTextBlur: (e: FocusEvent<HTMLInputElement>, id: string) => void;
}

export const DraggablePhraseItem = ({
  item,
  index,
  moveItem,
  handleTextChange,
  handleTextBlur,
}: DraggableItemProps) => {
  const ref = useRef<HTMLSpanElement>(null);

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
    hover(draggedItem: DragItem, monitor) {
      if (!ref.current) return;

      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: DND_ITEM_TYPE,
    item: () => ({ id: item.id, index, type: item.type }),
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

      <span
        ref={ref}
        data-handler-id={handlerId}
        className={[
          'cursor-grab transition-opacity',
          isDragging && 'opacity-20',
          isOver && 'ring-primary/50',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {item.type === 'TEXT' ? (
          <Input
            id={item.id}
            type="text"
            value={item.content}
            onChange={(e) => handleTextChange(e, item.id)}
            onBlur={(e) => handleTextBlur(e, item.id)}
            className="inline-block w-auto min-w-[10px] rounded-none border-none bg-transparent p-0 text-center shadow-none focus:border-none focus:ring-0 focus-visible:border-none focus-visible:ring-0 lg:text-lg"
            size={Math.max(item.content.length, 1)}
          />
        ) : (
          <div
            id={item.id}
            className="bg-primary flex rounded-lg px-4 py-1 text-sm text-white lg:px-3 lg:py-2 lg:text-base"
          >
            Lacuna
          </div>
        )}
      </span>
    </>
  );
};
