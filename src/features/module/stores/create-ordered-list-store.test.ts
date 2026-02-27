import { beforeEach, describe, expect, it } from 'vitest';
import { createOrderedListActions } from './create-ordered-list-store';

interface TestItem {
  id?: string;
  clientId?: string;
  type: string;
  draftData?: Record<string, unknown>;
}

describe('createOrderedListActions', () => {
  let state: Record<string, unknown>;
  let actions: ReturnType<typeof createOrderedListActions<TestItem>>;

  const mockSet = (
    partial:
      | Record<string, unknown>
      | ((state: Record<string, unknown>) => Record<string, unknown>),
  ) => {
    if (typeof partial === 'function') {
      Object.assign(state, partial(state));
    } else {
      Object.assign(state, partial);
    }
  };

  beforeEach(() => {
    state = { items: [], currentPosition: null };
    actions = createOrderedListActions<TestItem>(mockSet, {
      listKey: 'items',
    });
  });

  describe('setItems', () => {
    it('should set items with clientIds', () => {
      actions.setItems([{ type: 'A' }, { type: 'B', id: 'existing-id' }]);

      const items = state.items as TestItem[];
      expect(items).toHaveLength(2);
      expect(items[0].clientId).toBeDefined();
      expect(items[1].clientId).toBe('existing-id');
    });

    it('should generate clientId when id is missing', () => {
      actions.setItems([{ type: 'A' }]);

      const items = state.items as TestItem[];
      expect(items[0].clientId).toBeDefined();
      expect(items[0].clientId).not.toBe('');
    });
  });

  describe('addItem', () => {
    it('should add item at the specified index', () => {
      state.items = [{ type: 'A', clientId: '1' }, { type: 'C', clientId: '3' }];

      actions.addItem(1, { type: 'B' });

      const items = state.items as TestItem[];
      expect(items).toHaveLength(3);
      expect(items[1].type).toBe('B');
      expect(items[1].clientId).toBeDefined();
    });

    it('should update currentPosition to the insertion index', () => {
      state.items = [{ type: 'A', clientId: '1' }];

      actions.addItem(0, { type: 'B' });

      expect(state.currentPosition).toBe(0);
    });

    it('should add at the beginning', () => {
      state.items = [{ type: 'A', clientId: '1' }];

      actions.addItem(0, { type: 'B' });

      const items = state.items as TestItem[];
      expect(items[0].type).toBe('B');
      expect(items[1].type).toBe('A');
    });

    it('should add at the end', () => {
      state.items = [{ type: 'A', clientId: '1' }];

      actions.addItem(1, { type: 'B' });

      const items = state.items as TestItem[];
      expect(items[0].type).toBe('A');
      expect(items[1].type).toBe('B');
    });
  });

  describe('moveItem', () => {
    it('should swap items when moving forward', () => {
      state.items = [
        { type: 'A', clientId: '1' },
        { type: 'B', clientId: '2' },
        { type: 'C', clientId: '3' },
      ];

      actions.moveItem(0, 2);

      const items = state.items as TestItem[];
      expect(items.map((i) => i.type)).toEqual(['B', 'C', 'A']);
    });

    it('should swap items when moving backward', () => {
      state.items = [
        { type: 'A', clientId: '1' },
        { type: 'B', clientId: '2' },
        { type: 'C', clientId: '3' },
      ];

      actions.moveItem(2, 0);

      const items = state.items as TestItem[];
      expect(items.map((i) => i.type)).toEqual(['C', 'A', 'B']);
    });
  });

  describe('updateDraftData', () => {
    it('should update draft data at specified index', () => {
      state.items = [
        { type: 'A', clientId: '1', draftData: {} },
        { type: 'B', clientId: '2', draftData: {} },
      ];

      actions.updateDraftData(1, { field: 'value' });

      const items = state.items as TestItem[];
      expect(items[1].draftData).toEqual({ field: 'value' });
    });

    it('should not affect other items', () => {
      state.items = [
        { type: 'A', clientId: '1', draftData: { original: true } },
        { type: 'B', clientId: '2', draftData: {} },
      ];

      actions.updateDraftData(1, { field: 'value' });

      const items = state.items as TestItem[];
      expect(items[0].draftData).toEqual({ original: true });
    });
  });

  describe('removeItem', () => {
    it('should remove item at specified index', () => {
      state.items = [
        { type: 'A', clientId: '1' },
        { type: 'B', clientId: '2' },
        { type: 'C', clientId: '3' },
      ];
      state.currentPosition = 1;

      actions.removeItem(1);

      const items = state.items as TestItem[];
      expect(items).toHaveLength(2);
      expect(items.map((i) => i.type)).toEqual(['A', 'C']);
    });

    it('should set currentPosition to null when list becomes empty', () => {
      state.items = [{ type: 'A', clientId: '1' }];
      state.currentPosition = 0;

      actions.removeItem(0);

      expect(state.items).toEqual([]);
      expect(state.currentPosition).toBeNull();
    });

    it('should decrement currentPosition when removing before it', () => {
      state.items = [
        { type: 'A', clientId: '1' },
        { type: 'B', clientId: '2' },
        { type: 'C', clientId: '3' },
      ];
      state.currentPosition = 2;

      actions.removeItem(0);

      expect(state.currentPosition).toBe(1);
    });

    it('should adjust currentPosition when removing the current item', () => {
      state.items = [
        { type: 'A', clientId: '1' },
        { type: 'B', clientId: '2' },
        { type: 'C', clientId: '3' },
      ];
      state.currentPosition = 1;

      actions.removeItem(1);

      expect(state.currentPosition).toBe(0);
    });

    it('should not change currentPosition when removing after it', () => {
      state.items = [
        { type: 'A', clientId: '1' },
        { type: 'B', clientId: '2' },
        { type: 'C', clientId: '3' },
      ];
      state.currentPosition = 0;

      actions.removeItem(2);

      expect(state.currentPosition).toBe(0);
    });

    it('should keep currentPosition when it is null', () => {
      state.items = [
        { type: 'A', clientId: '1' },
        { type: 'B', clientId: '2' },
      ];
      state.currentPosition = null;

      actions.removeItem(0);

      expect(state.currentPosition).toBeNull();
    });
  });
});
