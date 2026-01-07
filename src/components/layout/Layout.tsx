import { ReactNode } from 'react';
import { MobileNav } from './MobileNav';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileHeader } from './MobileHeader';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <MobileHeader />
      
      <main className="md:pl-64">
        <div className="px-4 py-4 pb-24 md:px-6 md:py-6 md:pb-6">
          {children}
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
