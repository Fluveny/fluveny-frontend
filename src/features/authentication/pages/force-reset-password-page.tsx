import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/features/authentication/stores/auth-store';
import { KeyRound } from 'lucide-react';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function ForceResetPasswordPage() {
  const { resetPassword } = useAuthStore();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword({ newPassword });
      toast.success('Senha atualizada com sucesso!');
      navigate('/dashboard'); // ProtectedRoute will intercept and send to onboarding if needed
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Erro ao redefinir a senha.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen max-w-lg flex-col justify-center p-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <KeyRound className="size-8" />
        </div>
        <h1 className="text-foreground mb-2 text-3xl font-extrabold">
          Atualize sua Senha
        </h1>
        <p className="text-muted-foreground text-lg">
          Por motivos de segurança, você precisa redefinir a sua senha
          provisória antes de continuar.
        </p>
      </div>

      <div className="bg-card border-border overflow-hidden rounded-xl border p-6 shadow-xl md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirme a Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite novamente"
              required
              minLength={6}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full font-bold"
            >
              {isSubmitting ? 'Atualizando...' : 'Atualizar Senha e Continuar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
