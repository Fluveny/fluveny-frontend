import { Toggle } from '@/components/ui/toggle';
import type { ReactNode } from 'react';

interface SkillToggleProps {
  isPressed: boolean;
  onClick: () => void;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
}

export const SkillToggle = ({
  isPressed,
  onClick,
  label,
  icon,
  disabled,
}: SkillToggleProps) => {
  return (
    <div
      className={`m-2 flex flex-1 flex-col items-center ${disabled ? 'cursor-not-allowed opacity-35' : ''}`}
    >
      <Toggle
        className={`data-[state=on]:border-primary flex h-24 w-24 items-center justify-center border-2 ${!disabled ? 'cursor-pointer' : 'pointer-events-none'}`}
        onPressedChange={onClick}
        pressed={isPressed}
        disabled={disabled}
      >
        {icon}
      </Toggle>
      <p className="mt-1 text-center text-sm">{label}</p>
    </div>
  );
};
