import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/features/authentication/stores/auth-store';
import { LogOut, Settings, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tabs } from './ui/tabs';

export const UserProfile = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    setOpenProfile(false);
    await logout();
  };

  return (
    <div className="flex gap-5">
      <div className="hidden w-65 flex-col justify-center lg:flex">
        {user?.role === 'CONTENT_CREATOR' || user?.role === 'ADMIN' ? (
          <div className="flex items-end gap-2">
            <span className="text-foreground text-md font-semibold">
              {user?.name || user?.username}
            </span>
            <Badge variant="outline" className="bg-level-bg border-level/20">
              {user?.role === 'ADMIN' ? 'Admin' : 'Criador'}
            </Badge>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-foreground text-md font-semibold">
                {user?.name || user?.username}
              </span>
              <span className="text-primary text-sm font-medium">
                Nível {user?.level || 1}
              </span>
            </div>
            <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full"
                style={{
                  width: `${((user?.xp || 0) / (user?.maxXp || 100)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      <Popover open={openProfile} onOpenChange={setOpenProfile}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="group relative"
            onClick={() => setOpenProfile(true)}
          >
            <Avatar className="border-primary/20 group-hover:border-primary/40 size-14 cursor-pointer border-2 transition-colors">
              <AvatarImage src={user?.avatar} />
            </Avatar>
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="end">
          <Tabs defaultValue="profile" className="w-full">
            <div className="border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar className="border-primary/20 size-16 border-2">
                  <AvatarImage src={user?.avatar} />
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-foreground text-lg font-semibold">
                    {user?.name || user?.username}
                  </h4>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-level-bg text-level border-level/20"
                    >
                      {user?.role === 'ADMIN'
                        ? 'Administrador'
                        : user?.role === 'CONTENT_CREATOR'
                          ? 'Criador'
                          : user?.role === 'STUDENT'
                            ? 'Estudante'
                            : user?.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/profile" onClick={() => setOpenProfile(false)}>
                  <User className="mr-2 h-4 w-4" />
                  Ver perfil
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/settings" onClick={() => setOpenProfile(false)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Link>
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};
