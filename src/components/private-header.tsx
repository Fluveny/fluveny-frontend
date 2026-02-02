import { UserProfile } from '@/components/user-profile';
import { UserProfileSkeleton } from '@/components/user-profile-skeleton';
import { LayoutGrid, Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Button } from './ui/button';

const menuVariants = {
  closed: { height: 0, opacity: 0, transition: { duration: 0.2 } },
  open: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
};

export function PrivateHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoading = false;

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutSide = (event: MouseEvent) => {
      if (!menuOpen) return;

      const target = event.target as HTMLElement;

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutSide);

    return () => {
      document.removeEventListener('mousedown', handleClickOutSide);
    };
  }, [menuOpen]);

  return (
    <header className="relative flex h-16 w-full items-center justify-between border-b px-4 py-4 lg:px-8 lg:py-10">
      <div className="flex items-center gap-2">
        <Button
          ref={buttonRef}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Fechar Menu' : 'Abrir Menu'}
          variant="ghost"
          className="p-2 lg:hidden"
        >
          {menuOpen ? <X className="size-8" /> : <Menu className="size-8" />}
        </Button>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
          <img
            src="/assets/logo.svg"
            alt="Logo Fluveny"
            className="h-10 lg:h-12"
          />
        </Link>
        <nav className="hidden space-x-12 px-10 lg:flex">
          <Link to="/modules" className="hover:text-primary text-lg">
            Módulos
          </Link>
        </nav>
      </div>

      {isLoading ? <UserProfileSkeleton /> : <UserProfile />}

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            ref={menuRef}
            className="absolute top-16 left-0 z-99 w-full overflow-hidden bg-white shadow-md lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <ul className="z-50 flex flex-col divide-y">
              <li>
                <Link
                  to="/modules"
                  className="flex items-center gap-2 px-4 py-3 text-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  <LayoutGrid className="text-primary size-5" />
                  Módulos
                </Link>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
