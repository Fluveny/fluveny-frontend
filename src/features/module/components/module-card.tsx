import type { Module } from '@/@types/module';
import { ROUTES } from '@/app/configs/routes';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Tag } from './tag';

type ModuleCardProps = Module & {
  isDraft: boolean;
  progressPercentage?: number;
};

export const ModuleCard = ({
  id,
  title,
  grammarRules,
  isDraft,
  progressPercentage = 65,
}: ModuleCardProps) => {
  const navigate = useNavigate();

  const handleEnterModule = () => {
    if (isDraft) {
      navigate(`${ROUTES.modules}/${ROUTES.create}/${id}`);
    } else {
      navigate(`${ROUTES.modules}/${id}`);
    }
  };

  return (
    <li className="min-w-0 list-none">
      <Button
        onClick={handleEnterModule}
        className="group relative flex h-full min-h-60 w-full min-w-0 flex-initial flex-row items-center justify-between overflow-hidden rounded-md bg-[url(/img/party.webp)] bg-cover bg-center p-4 hover:cursor-pointer lg:min-h-70 lg:justify-center lg:p-6"
      >
        <div className="absolute inset-0 bg-black/40 transition-colors duration-300 lg:bg-black/20 lg:group-hover:bg-black/60" />

        <div className="relative z-10 flex h-full w-full flex-col items-start justify-between lg:w-auto lg:items-center">
          <div className="flex w-full flex-col items-start lg:items-center">
            <span className="w-full truncate text-left text-2xl font-bold break-words whitespace-normal text-zinc-50 lg:text-center lg:text-3xl">
              {title}
            </span>
            <ul className="mt-4 flex flex-wrap gap-2 lg:justify-center lg:gap-4">
              {grammarRules.map((grammarRule, index) => {
                return <Tag key={index} name={grammarRule.title} />;
              })}
            </ul>
          </div>
        </div>

        <div className="bg-primary/90 text-primary-foreground relative z-10 ml-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm lg:hidden">
          <Play fill="currentColor" className="ml-1 h-5 w-5" />
        </div>

        <div className="absolute inset-0 z-10 hidden items-center justify-center opacity-0 transition-all duration-300 lg:flex lg:group-hover:opacity-100">
          <div className="bg-primary text-primary-foreground flex h-16 w-16 scale-75 items-center justify-center rounded-full shadow-lg transition-transform duration-300 group-hover:scale-100 xl:h-20 xl:w-20">
            <Play
              fill="currentColor"
              className="ml-1 h-8 w-8 xl:h-10 xl:w-10"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 z-20 h-1.5 w-full bg-black/20 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100">
          <div
            className="bg-primary h-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </Button>
    </li>
  );
};
