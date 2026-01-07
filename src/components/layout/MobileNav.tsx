import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, CreditCard, Receipt, History, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Início' },
  { path: '/income', icon: Wallet, label: 'Renda' },
  { path: '/cards', icon: CreditCard, label: 'Cartões' },
  { path: '/expenses', icon: Receipt, label: 'Gastos' },
  { path: '/history', icon: History, label: 'Histórico' },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card pb-safe md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
