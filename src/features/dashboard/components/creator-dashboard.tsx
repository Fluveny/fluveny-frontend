import { ROUTES } from '@/app/configs/routes';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export const CreatorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-col gap-6 p-6 md:p-8">
      <Button onClick={() => navigate(ROUTES.create)}>Criar Novo Módulo</Button>
    </div>
  );
};
