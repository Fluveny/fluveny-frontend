import type { GrammarRule } from '@/@types/module';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal, Trash, X } from 'lucide-react';
import { parseAsArrayOf, parseAsString, useQueryStates } from 'nuqs';
import { createParser } from 'nuqs/server';
import { useState } from 'react';
import { useGetLevels } from '../hooks/api/queries/use-get-levels';
import { CheckboxGroup } from './checkbox-group';
import { FilterDropdown } from './filter-dropdown';
import { SelectGrammarRule } from './select-topic';

const statusOptions = {
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Finalizados',
  NOT_STARTED: 'Não iniciados',
  FAVORITE: 'Favoritos',
} as const;

type StatusKey = keyof typeof statusOptions;

const parseAsEnum = <T extends string>(validValues: readonly T[]) =>
  createParser({
    parse: (value) => {
      return validValues.includes(value as T) ? (value as T) : null;
    },
    serialize: (value) => String(value),
  });

export const parsers = {
  q: parseAsString.withDefault(''),
  grammarRules: parseAsArrayOf(parseAsString).withDefault([]),
  levels: parseAsArrayOf(parseAsString).withDefault([]),
  statuses: parseAsArrayOf(
    parseAsEnum(Object.keys(statusOptions) as StatusKey[]),
  ).withDefault([]),
};

export const ModuleFilter = ({ isCreator }: { isCreator?: boolean }) => {
  const [filters, setFilters] = useQueryStates(parsers);

  const [selectedGrammarRules, setSelectedGrammarRules] = useState<
    GrammarRule[]
  >([]);

  const { data: levelsData } = useGetLevels();

  const handleGrammarRulesChange = (newRules: GrammarRule[]) => {
    setSelectedGrammarRules(newRules);
    const newIds = newRules.map((r) => r.id);
    setFilters({ grammarRules: newIds.length > 0 ? newIds : null });
  };

  const handleLevelChange = (levelId: string) => {
    const newLevels = filters.levels.includes(levelId)
      ? filters.levels.filter((id) => id !== levelId)
      : [...filters.levels, levelId];
    setFilters({ levels: newLevels });
  };

  const handleStatusChange = (status: StatusKey) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    setFilters({ statuses: newStatuses });
  };

  const handleClearFilters = () => {
    setSelectedGrammarRules([]);
    setFilters({ q: '', grammarRules: [], levels: [], statuses: [] });
  };

  const hasActiveFilters =
    filters.q !== '' ||
    filters.grammarRules.length > 0 ||
    filters.levels.length > 0 ||
    filters.statuses.length > 0;

  const levelOptions =
    levelsData?.map((level) => ({
      value: level.id,
      label: level.title,
    })) ?? [];

  return (
    <div className="mb-6 flex flex-col gap-4 lg:mb-7">
      <div className="flex w-full items-center gap-2">
        <div className="relative flex-1 lg:flex-none">
          <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-zinc-400" />
          <Input
            value={filters.q}
            onChange={(e) => setFilters({ q: e.target.value || null })}
            className="h-12 w-full rounded-lg py-5 pr-4 pl-11 text-base placeholder:text-zinc-500 lg:h-auto lg:w-120 lg:py-3 lg:text-lg"
            placeholder="Busque pelo nome do módulo"
          />
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <SelectGrammarRule
            initialValue={filters.grammarRules}
            value={selectedGrammarRules}
            onSelectGrammarRule={handleGrammarRulesChange}
          />

          <FilterDropdown
            triggerText="Nível"
            items={levelOptions}
            selectedValues={filters.levels}
            onValueChange={handleLevelChange}
          />

          {!isCreator && (
            <FilterDropdown
              triggerText="Status"
              items={Object.entries(statusOptions).map(([value, label]) => ({
                value: value as StatusKey,
                label,
              }))}
              selectedValues={filters.statuses}
              onValueChange={handleStatusChange}
            />
          )}

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              className="flex items-center gap-1.5 py-6.5 text-base text-zinc-600 hover:text-zinc-900"
              onClick={handleClearFilters}
            >
              <X className="size-4" />
              Limpar
            </Button>
          )}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="flex h-12 w-12 items-center justify-center rounded-lg border-zinc-300 font-normal lg:hidden"
            >
              <SlidersHorizontal className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg">Filtros</DialogTitle>
              <DialogDescription className="text-zinc-500">
                Selecione as opções abaixo para refinar a busca.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6 py-4">
              <div className="space-y-2">
                <Label className="text-base font-bold">Regra Gramatical</Label>
                <div className="space-x-4">
                  <SelectGrammarRule
                    initialValue={filters.grammarRules}
                    value={selectedGrammarRules}
                    onSelectGrammarRule={handleGrammarRulesChange}
                    variant="dialog"
                  />
                </div>
              </div>

              <CheckboxGroup
                title="Nível de Dificuldade"
                items={levelOptions}
                selectedValues={filters.levels}
                onValueChange={handleLevelChange}
              />

              {!isCreator && (
                <CheckboxGroup
                  title="Status do Módulo"
                  items={Object.entries(statusOptions).map(([value, label]) => ({
                    value: value as StatusKey,
                    label,
                  }))}
                  selectedValues={filters.statuses}
                  onValueChange={handleStatusChange}
                />
              )}

              {hasActiveFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClearFilters}
                  className={'hover:text-destructive'}
                >
                  Remover filtros <Trash className="size-4" />
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
