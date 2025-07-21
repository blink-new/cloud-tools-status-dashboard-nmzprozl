import { Badge } from './ui/badge';
import { Service } from '../types/status';
import { cn } from '../lib/utils';

interface StatusBadgeProps {
  status: Service['status'];
  className?: string;
}

const statusConfig = {
  operational: {
    label: 'Operational',
    className: 'status-operational',
    icon: '●'
  },
  degraded: {
    label: 'Degraded',
    className: 'status-degraded',
    icon: '◐'
  },
  outage: {
    label: 'Outage',
    className: 'status-outage',
    icon: '●'
  },
  maintenance: {
    label: 'Maintenance',
    className: 'status-maintenance',
    icon: '◯'
  },
  unknown: {
    label: 'Unknown',
    className: 'status-unknown',
    icon: '?'
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        'text-xs font-medium border',
        config.className,
        className
      )}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
}