import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/features/authentication/stores/auth-store';
import { useState, type SyntheticEvent } from 'react';
import { toast } from 'sonner';

export function SettingsPage() {
  const { user, updateSettings } = useAuthStore();
  const [soundEnabled, setSoundEnabled] = useState(user?.soundEnabled ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateSettings({ soundEnabled });
      toast.success('Configurações salvas com sucesso!');
    } catch {
      toast.error('Erro ao salvar configurações.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="text-foreground mb-6 text-3xl font-bold">Configurações</h1>

      <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="soundEnabled" className="text-base">
                Efeitos Sonoros
              </Label>
              <p className="text-muted-foreground text-sm">
                Ativar ou desativar os efeitos sonoros da plataforma.
              </p>
            </div>
            <div>
              <input
                type="checkbox"
                id="soundEnabled"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300"
              />
            </div>
          </div>

          <div className="border-border mt-6 flex justify-end border-t pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
