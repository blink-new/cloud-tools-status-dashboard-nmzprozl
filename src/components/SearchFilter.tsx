import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, RefreshCw } from 'lucide-react';
import { Service } from '../types/status';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: Service['status'] | 'all';
  onStatusFilterChange: (status: Service['status'] | 'all') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  isRefreshing
}: SearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="operational">Operational</SelectItem>
          <SelectItem value="degraded">Degraded</SelectItem>
          <SelectItem value="outage">Outage</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
          <SelectItem value="unknown">Unknown</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        onClick={onRefresh} 
        disabled={isRefreshing}
        variant="outline"
        className="w-full sm:w-auto"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
}