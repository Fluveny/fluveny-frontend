import { SubTitle } from './subtitle';

interface DashboardHeaderProps {
  username: string;
  title: string;
  description: string;
}

export const DashboardHeader = ({
  username,
  title,
  description,
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
        Bem-vindo de volta, <span className="text-primary">{username}</span>!
      </h1>
      <SubTitle title={title} description={description} />
    </div>
  );
};
