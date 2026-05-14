import type { GrammarRule } from '@/@types/module';
import { cn } from '@/app/utils/cn';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGetGrammarRules } from '../hooks/api/queries/use-get-grammar-rules';

interface SelectGrammarRuleProps {
  initialValue: string[];
  value: GrammarRule[];
  onSelectGrammarRule: (grammarRules: GrammarRule[]) => void;
  variant?: 'desktop' | 'dialog';
}

export const SelectGrammarRule = ({
  initialValue,
  value,
  onSelectGrammarRule,
  variant = 'desktop',
}: SelectGrammarRuleProps) => {
  const [open, setOpen] = useState(false);
  const { data: response, isLoading, isError } = useGetGrammarRules();
  const grammarRules = response ?? [];

  useEffect(() => {
    if (!response || !initialValue) return;

    const grammarRules = response ?? [];
    const selected = grammarRules.filter((rule) =>
      initialValue.includes(rule.id),
    );

    const selectedIds = selected
      .map((rule) => rule.id)
      .sort()
      .join(',');
    const valueIds = value
      .map((rule) => rule.id)
      .sort()
      .join(',');

    if (selectedIds !== valueIds) {
      onSelectGrammarRule(selected);
    }
  }, [response, initialValue, onSelectGrammarRule, value]);

  const toggleGrammarRule = (rule: GrammarRule) => {
    const isSelected = value.some((r) => r.id === rule.id);
    let next: GrammarRule[];

    if (isSelected) {
      next = value.filter((r) => r.id !== rule.id);
    } else {
      if (value.length >= 5) return; // Limite de 5 seleções
      next = [...value, rule];
    }

    onSelectGrammarRule(next);
  };

  const triggerText =
    value.length > 0
      ? value.map((rule) => rule.title).join(', ')
      : 'Selecione as regras...';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-76 max-w-120 justify-between overflow-x-hidden font-normal md:w-100',
            variant === 'desktop'
              ? 'h-auto rounded-lg px-4 py-3.5 text-base'
              : 'h-12 text-base',
          )}
        >
          <span className="truncate">{triggerText}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="bottom" className="w-76 p-0 lg:w-100">
        <Command className="p-2 text-left">
          <CommandInput
            className="text-md"
            placeholder="Buscar regra gramatical..."
          />
          <CommandList>
            {isLoading && <CommandItem disabled>Carregando...</CommandItem>}
            {isError && <CommandEmpty>Erro ao carregar regras.</CommandEmpty>}
            {!isLoading && grammarRules.length === 0 && (
              <CommandEmpty>Nenhuma regra encontrada.</CommandEmpty>
            )}
            <CommandGroup>
              {grammarRules.map((grammarRule) => (
                <CommandItem
                  className="text-md"
                  key={grammarRule.id}
                  value={grammarRule.title}
                  onSelect={() => toggleGrammarRule(grammarRule)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.some((r) => r.id === grammarRule.id)
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {grammarRule.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
