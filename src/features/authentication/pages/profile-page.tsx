import { cn } from '@/app/utils/cn';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/features/authentication/stores/auth-store';
import { Pencil } from 'lucide-react';
import { useState, type SyntheticEvent } from 'react';
import { toast } from 'sonner';

const AVATAR_OPTIONS = [
  'https://i.ibb.co/7d4xHcCT/Untitled-design-3.jpg',
  'https://i.ibb.co/vvdC6Wn4/avatar-10.jpg',
  'https://i.ibb.co/DP1gTbh1/avatar-9.jpg',
  'https://i.ibb.co/Dn3knyS/avatar-8.jpg',
  'https://i.ibb.co/NHSBB2s/avatar-7.jpg',
  'https://i.ibb.co/Pvyz3Tn3/avatar-6.jpg',
  'https://i.ibb.co/wrzd4TLc/avatar-3.jpg',
  'https://i.ibb.co/nM1NQGZv/avatar-4.jpg',
  'https://i.ibb.co/nqnTf82m/avatar-1.jpg',
  'https://i.ibb.co/b42vgq4/avatar-2.jpg',
];

const BACKGROUND_OPTIONS = [
  'https://i.ibb.co/rGk5dyVx/Untitled-design-4.png',
  'https://i.ibb.co/TB8pxKfr/Untitled-design-3.png',
  'https://i.ibb.co/kT18Ztf/Untitled-design-2.png',
  'https://i.ibb.co/pv76skqJ/Untitled-design-1.png',
  'https://i.ibb.co/TqcW2pPt/Untitled-design.png',
];

export function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || AVATAR_OPTIONS[0]);
  const [background, setBackground] = useState(
    user?.background || BACKGROUND_OPTIONS[0],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isBgOpen, setIsBgOpen] = useState(false);

  const handleSubmit = async (e?: SyntheticEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProfile({ name, avatar, background });
      toast.success('Perfil atualizado com sucesso!');
    } catch {
      toast.error('Erro ao atualizar perfil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-foreground mb-6 text-3xl font-bold">Meu Perfil</h1>

      <div className="bg-card border-border overflow-hidden rounded-xl border shadow-sm">
        {/* Background Banner */}
        <div className="bg-muted group relative h-48 w-full md:h-64">
          {background ? (
            <img
              src={background}
              alt="Background"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-blue-400 to-indigo-500" />
          )}

          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 rounded-full opacity-80 transition-opacity hover:opacity-100"
            onClick={() => setIsBgOpen(true)}
          >
            <Pencil className="size-4" />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pt-16 pb-6 md:px-8 md:pt-20">
          {/* Avatar over banner */}
          <div className="absolute -top-16 left-6 md:-top-20 md:left-8">
            <div className="group relative">
              <Avatar className="border-background size-32 border-4 shadow-lg md:size-40">
                <AvatarImage src={avatar} className="object-cover" />
              </Avatar>
              <Button
                variant="secondary"
                size="icon"
                className="border-background absolute right-2 bottom-2 size-8 rounded-full border-2 opacity-90 transition-opacity hover:opacity-100"
                onClick={() => setIsAvatarOpen(true)}
              >
                <Pencil className="size-3" />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-2 space-y-6 md:mt-4">
            <div className="max-w-sm space-y-2">
              <Label htmlFor="name">Nome de Exibição</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
              />
            </div>

            <div className="border-border flex justify-end border-t pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Avatar Dialog */}
      <Dialog open={isAvatarOpen} onOpenChange={setIsAvatarOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Escolha um Avatar</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4 sm:grid-cols-4 md:grid-cols-5">
            {AVATAR_OPTIONS.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setAvatar(opt);
                  setIsAvatarOpen(false);
                }}
                className={cn(
                  'relative overflow-hidden rounded-full border-2 transition-all hover:scale-105',
                  avatar === opt
                    ? 'border-primary ring-primary ring-2 ring-offset-2'
                    : 'border-transparent',
                )}
              >
                <img
                  src={opt}
                  alt={`Avatar ${i}`}
                  className="aspect-square h-auto w-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Background Dialog */}
      <Dialog open={isBgOpen} onOpenChange={setIsBgOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Escolha um Background</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 md:grid-cols-3">
            {BACKGROUND_OPTIONS.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setBackground(opt);
                  setIsBgOpen(false);
                }}
                className={cn(
                  'relative aspect-[21/9] overflow-hidden rounded-lg border-2 transition-all hover:scale-105',
                  background === opt
                    ? 'border-primary ring-primary ring-2 ring-offset-2'
                    : 'border-transparent',
                )}
              >
                <img
                  src={opt}
                  alt={`Background ${i}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
