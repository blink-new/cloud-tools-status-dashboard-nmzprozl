export interface Service {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance' | 'unknown';
  category: string;
  url: string;
  description?: string;
  lastUpdated?: string;
  incidents?: Incident[];
}

export interface Incident {
  id: string;
  title: string;
  status: string;
  impact: string;
  created_at: string;
  updated_at: string;
  monitoring_at?: string;
  resolved_at?: string;
  shortlink: string;
}

export interface StatusResponse {
  services: Service[];
  lastUpdated: string;
  overallStatus: 'operational' | 'degraded' | 'outage' | 'maintenance';
}

export interface CategoryStats {
  total: number;
  operational: number;
  degraded: number;
  outage: number;
  maintenance: number;
  unknown: number;
}

export const SERVICE_CATEGORIES = [
  'All',
  'Cloud Providers',
  'AI/ML Services',
  'Development Tools',
  'Databases',
  'Monitoring',
  'CDN',
  'Communication',
  'Payment',
  'Security',
  'Analytics',
  'Storage',
  'Other'
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];