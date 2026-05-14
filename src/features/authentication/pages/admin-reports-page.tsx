import { BarChart3 } from 'lucide-react';

export const AdminReportsPage = () => {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center space-y-4 p-8 text-center">
      <div className="bg-primary/10 rounded-full p-6">
        <BarChart3 className="text-primary size-12" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
      <p className="text-muted-foreground max-w-[500px] text-lg">
        Esta funcionalidade estará disponível em breve. Aqui você poderá
        visualizar estatísticas de uso, engajamento e desempenho da plataforma.
      </p>
    </div>
  );
};
