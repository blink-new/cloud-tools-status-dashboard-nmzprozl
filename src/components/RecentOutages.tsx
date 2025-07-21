import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ExternalLink, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { statusService } from '../services/statusService';
import { Incident } from '../types/status';

interface OutageData {
  service: string;
  category: string;
  incidents: Incident[];
}

const RecentOutages: React.FC = () => {
  const [outages, setOutages] = useState<OutageData[]>([]);
  const [allIncidents, setAllIncidents] = useState<OutageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [outageData, incidentData] = await Promise.all([
          statusService.getTodaysOutages(),
          statusService.getAllTodaysIncidents()
        ]);
        setOutages(outageData);
        setAllIncidents(incidentData);
      } catch (err) {
        setError('Failed to fetch incident data');
        console.error('Error fetching incidents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'critical':
      case 'major':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'minor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'investigating':
      case 'identified':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'monitoring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'postmortem':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return `Today at ${formatTime(dateString)}`;
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const IncidentCard: React.FC<{ incident: Incident; serviceName: string; category: string }> = ({ 
    incident, 
    serviceName, 
    category 
  }) => (
    <Card className="mb-4 border-l-4 border-l-red-500">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="font-medium text-sm text-gray-600">{serviceName}</span>
              <Badge variant="outline" className="text-xs">
                {category}
              </Badge>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{incident.title}</h3>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(incident.created_at)}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(incident.shortlink, '_blank')}
            className="ml-2"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={getImpactColor(incident.impact)}>
            {incident.impact || 'Unknown'} Impact
          </Badge>
          <Badge className={getStatusColor(incident.status)}>
            {incident.status || 'Unknown'}
          </Badge>
          {incident.resolved_at && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              Resolved
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading incidents...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Incidents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalOutages = outages.reduce((sum, service) => sum + service.incidents.length, 0);
  const totalIncidents = allIncidents.reduce((sum, service) => sum + service.incidents.length, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Incidents
        </CardTitle>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>{totalOutages} Active Outages</span>
          <span>{totalIncidents} Total Incidents</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="outages" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="outages" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Active Outages ({totalOutages})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              All Incidents ({totalIncidents})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="outages" className="mt-4">
            {outages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">All Systems Operational</h3>
                <p className="text-gray-600">No active outages reported today across all monitored services.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {outages.map((serviceData, index) => 
                  serviceData.incidents.map((incident, incidentIndex) => (
                    <IncidentCard
                      key={`${index}-${incidentIndex}`}
                      incident={incident}
                      serviceName={serviceData.service}
                      category={serviceData.category}
                    />
                  ))
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-4">
            {allIncidents.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Incidents Today</h3>
                <p className="text-gray-600">No incidents reported today across all monitored services.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allIncidents.map((serviceData, index) => 
                  serviceData.incidents.map((incident, incidentIndex) => (
                    <IncidentCard
                      key={`all-${index}-${incidentIndex}`}
                      incident={incident}
                      serviceName={serviceData.service}
                      category={serviceData.category}
                    />
                  ))
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RecentOutages;