import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CircleUser, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export const PublicHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    // ADICIONADO: relative, z-50 e bg-white
    <header className="relative z-50 flex justify-between border-b bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 not-md:w-full">
        <Popover open={menuOpen} onOpenChange={setMenuOpen}>
          <PopoverTrigger asChild>
            <Button
              aria-label={menuOpen ? 'Fechar Menu' : 'Abrir Menu'}
              variant="ghost"
              className="cursor-pointer not-md:order-1 md:hidden"
            >
              {menuOpen ? (
                <X className="size-8" />
              ) : (
                <Menu className="size-8" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={15}
            className="w-screen rounded-sm p-0 shadow-md md:max-w-64 md:border-2"
          >
            <ul className="z-50 flex flex-col items-end divide-y pr-4">
              <li className="w-full">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-lg md:hidden"
                  onClick={() => setMenuOpen(false)}
                >
                  <CircleUser className="text-primary" />
                  Faça login
                </Link>
              </li>
              <li className="w-full">
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-lg md:hidden"
                  onClick={() => setMenuOpen(false)}
                >
                  <LogIn className="text-primary" />
                  Registre-se
                </Link>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
        <Link to="/">
          <img
            src="/assets/logo.svg"
            alt="Logo Fluveny"
            className="h-10 lg:h-12"
          />
        </Link>
      </div>

      <div className="flex items-center gap-10">
        <Link to={'/login'} className="hidden md:flex">
          <Button className="cursor-pointer px-8 py-5 text-xl">Login</Button>
        </Link>
        <Link
          to="/register"
          className="text-primary hidden cursor-pointer items-center text-xl hover:underline md:flex"
        >
          Cadastre-se
        </Link>
      </div>
    </header>
  );
};
