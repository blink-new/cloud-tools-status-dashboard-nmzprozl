import { Card, CardContent } from './ui/card';
import { StatusBadge } from './StatusBadge';
import { Service } from '../types/status';
import { ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface ServiceCardProps {
  service: Service;
  onClick?: () => void;
}

export function ServiceCard({ service, onClick }: ServiceCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.open(service.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]',
        'border-l-4',
        service.status === 'operational' && 'border-l-green-500',
        service.status === 'degraded' && 'border-l-yellow-500',
        service.status === 'outage' && 'border-l-red-500',
        service.status === 'maintenance' && 'border-l-blue-500',
        service.status === 'unknown' && 'border-l-gray-500'
      )}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-sm truncate">{service.name}</h3>
              <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            </div>
            <StatusBadge status={service.status} />
            {service.description && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {service.description}
              </p>
            )}
          </div>
        </div>
        {service.lastUpdated && (
          <div className="text-xs text-muted-foreground mt-3 pt-2 border-t">
            Updated: {new Date(service.lastUpdated).toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}