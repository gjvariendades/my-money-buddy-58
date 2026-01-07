import { AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Alert {
  type: 'warning' | 'danger';
  message: string;
}

interface AlertBannerProps {
  alerts: Alert[];
}

export function AlertBanner({ alerts }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState<number[]>([]);

  const visibleAlerts = alerts.filter((_, i) => !dismissed.includes(i));

  if (visibleAlerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, index) => {
        if (dismissed.includes(index)) return null;
        
        return (
          <div
            key={index}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg text-sm',
              alert.type === 'danger' 
                ? 'bg-destructive/10 text-destructive border border-destructive/20'
                : 'bg-warning/10 text-warning-foreground border border-warning/20'
            )}
          >
            {alert.type === 'danger' ? (
              <AlertCircle className="h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            <span className="flex-1">{alert.message}</span>
            <button
              onClick={() => setDismissed([...dismissed, index])}
              className="shrink-0 opacity-60 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
