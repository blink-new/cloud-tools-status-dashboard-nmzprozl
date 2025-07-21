import { useState, useEffect, useMemo } from 'react';
import { OverallStatus } from './OverallStatus';
import { CategoryFilter } from './CategoryFilter';
import { SearchFilter } from './SearchFilter';
import { ServiceCard } from './ServiceCard';
import { Service, ServiceCategory, StatusResponse } from '../types/status';
import { statusService } from '../services/statusService';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';

export function StatusDashboard() {
  const [statusData, setStatusData] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Service['status'] | 'all'>('all');

  const loadStatus = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        // For refresh, get fresh data
        const data = await statusService.refreshStatus();
        setStatusData(data);
      } else {
        setLoading(true);
        // For initial load, use cached data with background update for speed
        const data = await statusService.getStatusWithBackgroundUpdate();
        setStatusData(data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to load status data. Please try again.');
      console.error('Error loading status:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStatus();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadStatus(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const filteredServices = useMemo(() => {
    if (!statusData) return [];
    
    let services = statusData.services;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      services = services.filter(service => service.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      services = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      services = services.filter(service => service.status === statusFilter);
    }
    
    return services;
  }, [statusData, selectedCategory, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-12 w-full mb-6" />
          <Skeleton className="h-16 w-full mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!statusData) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Cloud & Tools Status Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time monitoring of major cloud providers and development tools
              </p>
              <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block">
                ✅ Now fetching live status data from official status pages
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Auto-refresh: 5min
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Overall Status */}
        <OverallStatus
          services={statusData.services}
          overallStatus={statusData.overallStatus}
          lastUpdated={statusData.lastUpdated}
        />

        {/* Category Filter */}
        <div className="mb-6">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            services={statusData.services}
          />
        </div>

        {/* Search and Filters */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onRefresh={() => loadStatus(true)}
          isRefreshing={refreshing}
        />

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              No services found matching your criteria.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredServices.map((service) => (
              <ServiceCard
                key={`${service.name}-${service.category}`}
                service={service}
              />
            ))}
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {filteredServices.length} of {statusData.services.length} services
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
          {statusFilter !== 'all' && ` with ${statusFilter} status`}
        </div>

        {/* Data Source Disclaimer */}
        <div className="mt-6 text-center text-xs text-muted-foreground border-t pt-4">
          Status data is fetched directly from official service status pages. 
          Click on any service card to visit their official status page for detailed information.
          Data is cached for 5 minutes and refreshed automatically.
        </div>
      </main>
    </div>
  );
}