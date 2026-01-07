import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, CreditCard, Receipt, History, Settings, Moon, Sun, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/income', icon: Wallet, label: 'Renda' },
  { path: '/cards', icon: CreditCard, label: 'Cartões' },
  { path: '/expenses', icon: Receipt, label: 'Gastos' },
  { path: '/history', icon: History, label: 'Histórico' },
  { path: '/settings', icon: Settings, label: 'Configurações' },
];

export function DesktopSidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-card">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold">FinControl</h1>
            <p className="text-xs text-muted-foreground">Seu controle financeiro</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={toggleTheme}
          >
            {theme === 'light' ? (
              <>
                <Moon className="h-5 w-5" />
                Modo escuro
              </>
            ) : (
              <>
                <Sun className="h-5 w-5" />
                Modo claro
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
