import { UserProfile } from '@/components/user-profile';
import { UserProfileSkeleton } from '@/components/user-profile-skeleton';
import { useAuthStore } from '@/features/authentication/stores/auth-store';
import { BarChart3, LayoutGrid, Menu, Users, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { Button } from './ui/button';

const menuVariants = {
  closed: { height: 0, opacity: 0, transition: { duration: 0.2 } },
  open: { height: 'auto', opacity: 1, transition: { duration: 0.3 } },
};

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const adminNavItems: NavItem[] = [
  {
    to: '/admin/creators',
    label: 'Gerenciar Criadores',
    icon: <Users className="text-primary size-5" />,
  },
  {
    to: '/admin/reports',
    label: 'Relatórios',
    icon: <BarChart3 className="text-primary size-5" />,
  },
];

const creatorNavItems: NavItem[] = [
  {
    to: '/modules',
    label: 'Módulos',
    icon: <LayoutGrid className="text-primary size-5" />,
  },
  {
    to: '/modules/drafts',
    label: 'Gerenciar Módulos',
    icon: <LayoutGrid className="text-primary size-5" />,
  },
];

const defaultNavItems: NavItem[] = [
  {
    to: '/modules',
    label: 'Módulos',
    icon: <LayoutGrid className="text-primary size-5" />,
  },
];

export function PrivateHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoading, user } = useAuthStore();

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const navItems =
    user?.role === 'ADMIN'
      ? adminNavItems
      : user?.role === 'CONTENT_CREATOR'
        ? creatorNavItems
        : defaultNavItems;

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
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="hover:text-primary text-lg"
            >
              {item.label}
            </Link>
          ))}
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
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-2 px-4 py-3 text-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
