export interface OrderedItem {
  id?: string;
  clientId?: string;
  draftData?: Record<string, unknown>;
}

interface OrderedListConfig {
  listKey: string;
}

export function createOrderedListActions<T extends OrderedItem>(
  set: (
    partial:
      | Record<string, unknown>
      | ((state: Record<string, unknown>) => Record<string, unknown>),
  ) => void,
  config: OrderedListConfig,
) {
  const { listKey } = config;

  return {
    setItems: (list: T[]) => {
      const listWithClientIds = list.map((w) => ({
        ...w,
        clientId: w.id || crypto.randomUUID(),
      }));
      set({ [listKey]: listWithClientIds });
    },

    addItem: (index: number, item: Omit<T, 'clientId'>) =>
      set((state) => {
        const currentList = (state[listKey] as T[]) || [];
        const newList = [...currentList];
        const newItem = {
          ...item,
          clientId: crypto.randomUUID(),
        } as T;
        newList.splice(index, 0, newItem);
        return { [listKey]: newList, currentPosition: index };
      }),

    moveItem: (dragIndex: number, hoverIndex: number) =>
      set((state) => {
        const currentList = (state[listKey] as T[]) || [];
        const reordered = [...currentList];
        const [dragged] = reordered.splice(dragIndex, 1);
        reordered.splice(hoverIndex, 0, dragged);
        return { [listKey]: reordered };
      }),

    updateDraftData: (index: number, data: T['draftData']) =>
      set((state) => {
        const currentList = (state[listKey] as T[]) || [];
        const newList = currentList.map((item, i) =>
          i === index ? { ...item, draftData: data } : item,
        );
        return { [listKey]: newList };
      }),

    removeItem: (indexToRemove: number) =>
      set((state) => {
        const currentList = (state[listKey] as T[]) || [];
        const oldPosition = state.currentPosition as number | null;
        const newList = currentList.filter(
          (_, index) => index !== indexToRemove,
        );

        if (newList.length === 0) {
          return { [listKey]: [], currentPosition: null };
        }

        if (oldPosition === null) {
          return { [listKey]: newList };
        }

        let newPosition = oldPosition;
        if (indexToRemove < oldPosition) {
          newPosition = oldPosition - 1;
        } else if (indexToRemove === oldPosition) {
          newPosition = Math.max(0, oldPosition - 1);
        }

        return { [listKey]: newList, currentPosition: newPosition };
      }),
  };
}
