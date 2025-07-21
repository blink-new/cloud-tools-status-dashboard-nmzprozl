import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { StatusBadge } from './StatusBadge';
import { Service, CategoryStats } from '../types/status';
import { Activity, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface OverallStatusProps {
  services: Service[];
  overallStatus: 'operational' | 'degraded' | 'outage' | 'maintenance';
  lastUpdated: string;
}

export function OverallStatus({ services, overallStatus, lastUpdated }: OverallStatusProps) {
  const stats: CategoryStats = {
    total: services.length,
    operational: services.filter(s => s.status === 'operational').length,
    degraded: services.filter(s => s.status === 'degraded').length,
    outage: services.filter(s => s.status === 'outage').length,
    maintenance: services.filter(s => s.status === 'maintenance').length,
    unknown: services.filter(s => s.status === 'unknown').length,
  };

  const getOverallIcon = () => {
    switch (overallStatus) {
      case 'operational':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'outage':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'maintenance':
        return <Clock className="h-6 w-6 text-blue-600" />;
      default:
        return <Activity className="h-6 w-6 text-gray-600" />;
    }
  };

  const getOverallMessage = () => {
    switch (overallStatus) {
      case 'operational':
        return 'All systems operational';
      case 'degraded':
        return 'Some systems experiencing issues';
      case 'outage':
        return 'Major service disruptions detected';
      case 'maintenance':
        return 'Scheduled maintenance in progress';
      default:
        return 'Status unknown';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          {getOverallIcon()}
          <div>
            <div className="text-lg font-semibold">{getOverallMessage()}</div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.operational}</div>
            <div className="text-xs text-muted-foreground">Operational</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.degraded}</div>
            <div className="text-xs text-muted-foreground">Degraded</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.outage}</div>
            <div className="text-xs text-muted-foreground">Outage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.maintenance}</div>
            <div className="text-xs text-muted-foreground">Maintenance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Total Services</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}