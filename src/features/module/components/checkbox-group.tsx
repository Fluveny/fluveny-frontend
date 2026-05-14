import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { type ReactNode } from 'react';

interface CheckboxGroupProps<T extends string> {
  title: string;
  items: Readonly<Array<{ value: T; label: ReactNode }>>;
  selectedValues: T[];
  onValueChange: (value: T) => void;
}

export const CheckboxGroup = <T extends string>({
  title,
  items,
  selectedValues,
  onValueChange,
}: CheckboxGroupProps<T>) => {
  return (
    <div className="grid w-full gap-4">
      <Label className="text-md font-bold">{title}</Label>
      <div className="grid grid-cols-3 gap-x-6 gap-y-3">
        {items.map((item) => (
          <Label key={item.value} className="text-md font-normal">
            <Checkbox
              checked={selectedValues.includes(item.value)}
              onCheckedChange={() => onValueChange(item.value)}
            />
            {item.label}
          </Label>
        ))}
      </div>
    </div>
  );
};
