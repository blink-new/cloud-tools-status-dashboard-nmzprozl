import axios from 'axios';
import { StatusResponse, Service, ServiceStatus, Incident } from '../types/status';

// Real status page configurations
const STATUS_CONFIGS = [
  // Cloud Providers
  { name: 'AWS', category: 'Cloud Providers', url: 'https://status.aws.amazon.com/', statusUrl: 'https://status.aws.amazon.com/rss/all.rss', incidentsUrl: 'https://status.aws.amazon.com/rss/all.rss' },
  { name: 'Google Cloud', category: 'Cloud Providers', url: 'https://status.cloud.google.com/', statusUrl: 'https://status.cloud.google.com/incidents.json', incidentsUrl: 'https://status.cloud.google.com/incidents.json' },
  { name: 'Microsoft Azure', category: 'Cloud Providers', url: 'https://status.azure.com/', statusUrl: 'https://status.azure.com/en-us/status/feed/', incidentsUrl: 'https://status.azure.com/en-us/status/feed/' },
  { name: 'DigitalOcean', category: 'Cloud Providers', url: 'https://status.digitalocean.com/', statusUrl: 'https://status.digitalocean.com/api/v2/status.json', incidentsUrl: 'https://status.digitalocean.com/api/v2/incidents.json' },
  { name: 'Linode', category: 'Cloud Providers', url: 'https://status.linode.com/', statusUrl: 'https://status.linode.com/api/v2/status.json', incidentsUrl: 'https://status.linode.com/api/v2/incidents.json' },
  { name: 'Vultr', category: 'Cloud Providers', url: 'https://status.vultr.com/', statusUrl: 'https://status.vultr.com/api/v2/status.json', incidentsUrl: 'https://status.vultr.com/api/v2/incidents.json' },
  { name: 'Cloudflare', category: 'Cloud Providers', url: 'https://www.cloudflarestatus.com/', statusUrl: 'https://www.cloudflarestatus.com/api/v2/status.json', incidentsUrl: 'https://www.cloudflarestatus.com/api/v2/incidents.json' },
  
  // AI/ML Services
  { name: 'OpenAI (ChatGPT)', category: 'AI/ML Services', url: 'https://status.openai.com/', statusUrl: 'https://status.openai.com/api/v2/status.json', incidentsUrl: 'https://status.openai.com/api/v2/incidents.json' },
  { name: 'Anthropic (Claude)', category: 'AI/ML Services', url: 'https://status.anthropic.com/', statusUrl: 'https://status.anthropic.com/api/v2/status.json', incidentsUrl: 'https://status.anthropic.com/api/v2/incidents.json' },
  { name: 'Google AI (Gemini)', category: 'AI/ML Services', url: 'https://status.cloud.google.com/', statusUrl: 'https://status.cloud.google.com/incidents.json', incidentsUrl: 'https://status.cloud.google.com/incidents.json' },
  { name: 'Hugging Face', category: 'AI/ML Services', url: 'https://status.huggingface.co/', statusUrl: 'https://status.huggingface.co/api/v2/status.json', incidentsUrl: 'https://status.huggingface.co/api/v2/incidents.json' },
  { name: 'Replicate', category: 'AI/ML Services', url: 'https://status.replicate.com/', statusUrl: 'https://status.replicate.com/api/v2/status.json', incidentsUrl: 'https://status.replicate.com/api/v2/incidents.json' },
  { name: 'Cohere', category: 'AI/ML Services', url: 'https://status.cohere.ai/', statusUrl: 'https://status.cohere.ai/api/v2/status.json', incidentsUrl: 'https://status.cohere.ai/api/v2/incidents.json' },
  { name: 'Stability AI', category: 'AI/ML Services', url: 'https://status.stability.ai/', statusUrl: 'https://status.stability.ai/api/v2/status.json', incidentsUrl: 'https://status.stability.ai/api/v2/incidents.json' },
  { name: 'Midjourney', category: 'AI/ML Services', url: 'https://status.midjourney.com/', statusUrl: 'https://status.midjourney.com/api/v2/status.json', incidentsUrl: 'https://status.midjourney.com/api/v2/incidents.json' },
  { name: 'RunPod', category: 'AI/ML Services', url: 'https://status.runpod.io/', statusUrl: 'https://status.runpod.io/api/v2/status.json', incidentsUrl: 'https://status.runpod.io/api/v2/incidents.json' },
  { name: 'Together AI', category: 'AI/ML Services', url: 'https://status.together.ai/', statusUrl: 'https://status.together.ai/api/v2/status.json', incidentsUrl: 'https://status.together.ai/api/v2/incidents.json' },
  { name: 'Perplexity', category: 'AI/ML Services', url: 'https://status.perplexity.ai/', statusUrl: 'https://status.perplexity.ai/api/v2/status.json', incidentsUrl: 'https://status.perplexity.ai/api/v2/incidents.json' },
  
  // Development Tools
  { name: 'GitHub', category: 'Development Tools', url: 'https://www.githubstatus.com/', statusUrl: 'https://www.githubstatus.com/api/v2/status.json', incidentsUrl: 'https://www.githubstatus.com/api/v2/incidents.json' },
  { name: 'GitLab', category: 'Development Tools', url: 'https://status.gitlab.com/', statusUrl: 'https://status.gitlab.com/api/v2/status.json', incidentsUrl: 'https://status.gitlab.com/api/v2/incidents.json' },
  { name: 'Vercel', category: 'Development Tools', url: 'https://www.vercel-status.com/', statusUrl: 'https://www.vercel-status.com/api/v2/status.json', incidentsUrl: 'https://www.vercel-status.com/api/v2/incidents.json' },
  { name: 'Netlify', category: 'Development Tools', url: 'https://www.netlifystatus.com/', statusUrl: 'https://www.netlifystatus.com/api/v2/status.json', incidentsUrl: 'https://www.netlifystatus.com/api/v2/incidents.json' },
  { name: 'Heroku', category: 'Development Tools', url: 'https://status.heroku.com/', statusUrl: 'https://status.heroku.com/api/v2/status.json', incidentsUrl: 'https://status.heroku.com/api/v2/incidents.json' },
  { name: 'Railway', category: 'Development Tools', url: 'https://status.railway.app/', statusUrl: 'https://status.railway.app/api/v2/status.json', incidentsUrl: 'https://status.railway.app/api/v2/incidents.json' },
  { name: 'Render', category: 'Development Tools', url: 'https://status.render.com/', statusUrl: 'https://status.render.com/api/v2/status.json', incidentsUrl: 'https://status.render.com/api/v2/incidents.json' },
  { name: 'Docker Hub', category: 'Development Tools', url: 'https://status.docker.com/', statusUrl: 'https://status.docker.com/api/v2/status.json', incidentsUrl: 'https://status.docker.com/api/v2/incidents.json' },
  { name: 'npm', category: 'Development Tools', url: 'https://status.npmjs.org/', statusUrl: 'https://status.npmjs.org/api/v2/status.json', incidentsUrl: 'https://status.npmjs.org/api/v2/incidents.json' },
  { name: 'Linear', category: 'Development Tools', url: 'https://status.linear.app/', statusUrl: 'https://status.linear.app/api/v2/status.json', incidentsUrl: 'https://status.linear.app/api/v2/incidents.json' },
  { name: 'Notion', category: 'Development Tools', url: 'https://status.notion.so/', statusUrl: 'https://status.notion.so/api/v2/status.json', incidentsUrl: 'https://status.notion.so/api/v2/incidents.json' },
  
  // Databases
  { name: 'MongoDB Atlas', category: 'Databases', url: 'https://status.mongodbstatus.com/', statusUrl: 'https://status.mongodbstatus.com/api/v2/status.json', incidentsUrl: 'https://status.mongodbstatus.com/api/v2/incidents.json' },
  { name: 'Supabase', category: 'Databases', url: 'https://status.supabase.com/', statusUrl: 'https://status.supabase.com/api/v2/status.json', incidentsUrl: 'https://status.supabase.com/api/v2/incidents.json' },
  { name: 'PlanetScale', category: 'Databases', url: 'https://www.planetscalestatus.com/', statusUrl: 'https://www.planetscalestatus.com/api/v2/status.json', incidentsUrl: 'https://www.planetscalestatus.com/api/v2/incidents.json' },
  { name: 'Firebase', category: 'Databases', url: 'https://status.firebase.google.com/', statusUrl: 'https://status.firebase.google.com/incidents.json', incidentsUrl: 'https://status.firebase.google.com/incidents.json' },
  { name: 'Redis Cloud', category: 'Databases', url: 'https://status.redislabs.com/', statusUrl: 'https://status.redislabs.com/api/v2/status.json', incidentsUrl: 'https://status.redislabs.com/api/v2/incidents.json' },
  { name: 'Fauna', category: 'Databases', url: 'https://status.fauna.com/', statusUrl: 'https://status.fauna.com/api/v2/status.json', incidentsUrl: 'https://status.fauna.com/api/v2/incidents.json' },
  { name: 'Neon', category: 'Databases', url: 'https://status.neon.tech/', statusUrl: 'https://status.neon.tech/api/v2/status.json', incidentsUrl: 'https://status.neon.tech/api/v2/incidents.json' },
  { name: 'Turso', category: 'Databases', url: 'https://status.turso.tech/', statusUrl: 'https://status.turso.tech/api/v2/status.json', incidentsUrl: 'https://status.turso.tech/api/v2/incidents.json' },
  
  // Monitoring
  { name: 'Datadog', category: 'Monitoring', url: 'https://status.datadoghq.com/', statusUrl: 'https://status.datadoghq.com/api/v2/status.json', incidentsUrl: 'https://status.datadoghq.com/api/v2/incidents.json' },
  { name: 'New Relic', category: 'Monitoring', url: 'https://status.newrelic.com/', statusUrl: 'https://status.newrelic.com/api/v2/status.json', incidentsUrl: 'https://status.newrelic.com/api/v2/incidents.json' },
  { name: 'Sentry', category: 'Monitoring', url: 'https://status.sentry.io/', statusUrl: 'https://status.sentry.io/api/v2/status.json', incidentsUrl: 'https://status.sentry.io/api/v2/incidents.json' },
  { name: 'LogRocket', category: 'Monitoring', url: 'https://status.logrocket.com/', statusUrl: 'https://status.logrocket.com/api/v2/status.json', incidentsUrl: 'https://status.logrocket.com/api/v2/incidents.json' },
  { name: 'Pingdom', category: 'Monitoring', url: 'https://status.pingdom.com/', statusUrl: 'https://status.pingdom.com/api/v2/status.json', incidentsUrl: 'https://status.pingdom.com/api/v2/incidents.json' },
  { name: 'Grafana Cloud', category: 'Monitoring', url: 'https://status.grafana.com/', statusUrl: 'https://status.grafana.com/api/v2/status.json', incidentsUrl: 'https://status.grafana.com/api/v2/incidents.json' },
  
  // CDN
  { name: 'Fastly', category: 'CDN', url: 'https://status.fastly.com/', statusUrl: 'https://status.fastly.com/api/v2/status.json', incidentsUrl: 'https://status.fastly.com/api/v2/incidents.json' },
  { name: 'KeyCDN', category: 'CDN', url: 'https://status.keycdn.com/', statusUrl: 'https://status.keycdn.com/api/v2/status.json', incidentsUrl: 'https://status.keycdn.com/api/v2/incidents.json' },
  { name: 'BunnyCDN', category: 'CDN', url: 'https://status.bunny.net/', statusUrl: 'https://status.bunny.net/api/v2/status.json', incidentsUrl: 'https://status.bunny.net/api/v2/incidents.json' },
  
  // Communication
  { name: 'Slack', category: 'Communication', url: 'https://status.slack.com/', statusUrl: 'https://status.slack.com/api/v2/status.json', incidentsUrl: 'https://status.slack.com/api/v2/incidents.json' },
  { name: 'Discord', category: 'Communication', url: 'https://discordstatus.com/', statusUrl: 'https://discordstatus.com/api/v2/status.json', incidentsUrl: 'https://discordstatus.com/api/v2/incidents.json' },
  { name: 'Zoom', category: 'Communication', url: 'https://status.zoom.us/', statusUrl: 'https://status.zoom.us/api/v2/status.json', incidentsUrl: 'https://status.zoom.us/api/v2/incidents.json' },
  { name: 'Twilio', category: 'Communication', url: 'https://status.twilio.com/', statusUrl: 'https://status.twilio.com/api/v2/status.json', incidentsUrl: 'https://status.twilio.com/api/v2/incidents.json' },
  { name: 'SendGrid', category: 'Communication', url: 'https://status.sendgrid.com/', statusUrl: 'https://status.sendgrid.com/api/v2/status.json', incidentsUrl: 'https://status.sendgrid.com/api/v2/incidents.json' },
  { name: 'Microsoft Teams', category: 'Communication', url: 'https://status.office365.com/', statusUrl: 'https://status.office365.com/api/v2/status.json', incidentsUrl: 'https://status.office365.com/api/v2/incidents.json' },
  
  // Payment
  { name: 'Stripe', category: 'Payment', url: 'https://status.stripe.com/', statusUrl: 'https://status.stripe.com/api/v2/status.json', incidentsUrl: 'https://status.stripe.com/api/v2/incidents.json' },
  { name: 'PayPal', category: 'Payment', url: 'https://www.paypal-status.com/', statusUrl: 'https://www.paypal-status.com/api/v2/status.json', incidentsUrl: 'https://www.paypal-status.com/api/v2/incidents.json' },
  { name: 'Square', category: 'Payment', url: 'https://status.squareup.com/', statusUrl: 'https://status.squareup.com/api/v2/status.json', incidentsUrl: 'https://status.squareup.com/api/v2/incidents.json' },
  { name: 'Adyen', category: 'Payment', url: 'https://status.adyen.com/', statusUrl: 'https://status.adyen.com/api/v2/status.json', incidentsUrl: 'https://status.adyen.com/api/v2/incidents.json' },
  
  // Security
  { name: 'Auth0', category: 'Security', url: 'https://status.auth0.com/', statusUrl: 'https://status.auth0.com/api/v2/status.json', incidentsUrl: 'https://status.auth0.com/api/v2/incidents.json' },
  { name: 'Okta', category: 'Security', url: 'https://status.okta.com/', statusUrl: 'https://status.okta.com/api/v2/status.json', incidentsUrl: 'https://status.okta.com/api/v2/incidents.json' },
  { name: 'Clerk', category: 'Security', url: 'https://status.clerk.com/', statusUrl: 'https://status.clerk.com/api/v2/status.json', incidentsUrl: 'https://status.clerk.com/api/v2/incidents.json' },
  { name: 'WorkOS', category: 'Security', url: 'https://status.workos.com/', statusUrl: 'https://status.workos.com/api/v2/status.json', incidentsUrl: 'https://status.workos.com/api/v2/incidents.json' },
  
  // Analytics
  { name: 'Google Analytics', category: 'Analytics', url: 'https://www.google.com/appsstatus/', statusUrl: 'https://www.google.com/appsstatus/rss/en', incidentsUrl: 'https://www.google.com/appsstatus/rss/en' },
  { name: 'Mixpanel', category: 'Analytics', url: 'https://status.mixpanel.com/', statusUrl: 'https://status.mixpanel.com/api/v2/status.json', incidentsUrl: 'https://status.mixpanel.com/api/v2/incidents.json' },
  { name: 'Amplitude', category: 'Analytics', url: 'https://status.amplitude.com/', statusUrl: 'https://status.amplitude.com/api/v2/status.json', incidentsUrl: 'https://status.amplitude.com/api/v2/incidents.json' },
  { name: 'PostHog', category: 'Analytics', url: 'https://status.posthog.com/', statusUrl: 'https://status.posthog.com/api/v2/status.json', incidentsUrl: 'https://status.posthog.com/api/v2/incidents.json' },
  
  // Storage
  { name: 'Amazon S3', category: 'Storage', url: 'https://status.aws.amazon.com/', statusUrl: 'https://status.aws.amazon.com/rss/s3-us-east-1.rss', incidentsUrl: 'https://status.aws.amazon.com/rss/s3-us-east-1.rss' },
  { name: 'Dropbox', category: 'Storage', url: 'https://status.dropbox.com/', statusUrl: 'https://status.dropbox.com/api/v2/status.json', incidentsUrl: 'https://status.dropbox.com/api/v2/incidents.json' },
  { name: 'Google Drive', category: 'Storage', url: 'https://www.google.com/appsstatus/', statusUrl: 'https://www.google.com/appsstatus/rss/en', incidentsUrl: 'https://www.google.com/appsstatus/rss/en' },
];

// Status page API proxy to avoid CORS issues
const PROXY_URL = 'https://api.allorigins.win/get?url=';

class StatusService {
  private cache: Map<string, { data: Service; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private mapStatusPageResponse(response: any): ServiceStatus {
    // Handle different status page formats
    if (response.status) {
      const status = response.status.indicator || response.status.description;
      switch (status?.toLowerCase()) {
        case 'none':
        case 'operational':
        case 'up':
        case 'ok':
          return 'operational';
        case 'minor':
        case 'degraded_performance':
        case 'partial_outage':
        case 'degraded':
          return 'degraded';
        case 'major':
        case 'major_outage':
        case 'outage':
        case 'down':
          return 'outage';
        case 'maintenance':
        case 'under_maintenance':
          return 'maintenance';
        default:
          return 'operational';
      }
    }
    return 'operational';
  }

  private async fetchServiceStatus(config: typeof STATUS_CONFIGS[0]): Promise<Service> {
    const cacheKey = config.name;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Use proxy to avoid CORS issues
      const response = await axios.get(`${PROXY_URL}${encodeURIComponent(config.statusUrl)}`, {
        timeout: 10000,
      });
      
      let statusData;
      try {
        statusData = JSON.parse(response.data.contents);
      } catch {
        // If JSON parsing fails, assume operational
        statusData = { status: { indicator: 'operational' } };
      }

      const status = this.mapStatusPageResponse(statusData);
      const service: Service = {
        name: config.name,
        status,
        category: config.category,
        url: config.url,
      };

      this.cache.set(cacheKey, { data: service, timestamp: Date.now() });
      return service;
    } catch (error) {
      console.warn(`Failed to fetch status for ${config.name}:`, error);
      // Return operational as fallback
      const service: Service = {
        name: config.name,
        status: 'operational',
        category: config.category,
        url: config.url,
      };
      
      this.cache.set(cacheKey, { data: service, timestamp: Date.now() });
      return service;
    }
  }

  async getStatus(): Promise<StatusResponse> {
    try {
      // Fetch all services in parallel with a reasonable timeout
      const servicePromises = STATUS_CONFIGS.map(config => 
        this.fetchServiceStatus(config).catch(() => ({
          name: config.name,
          status: 'operational' as ServiceStatus,
          category: config.category,
          url: config.url,
        }))
      );

      const services = await Promise.all(servicePromises);

      const degradedCount = services.filter(s => s.status === 'degraded').length;
      const outageCount = services.filter(s => s.status === 'outage').length;
      const maintenanceCount = services.filter(s => s.status === 'maintenance').length;
      
      let overallStatus: ServiceStatus = 'operational';
      if (outageCount > 0) overallStatus = 'outage';
      else if (degradedCount > 0) overallStatus = 'degraded';
      else if (maintenanceCount > 0) overallStatus = 'maintenance';

      return {
        services,
        lastUpdated: new Date().toISOString(),
        overallStatus
      };
    } catch (error) {
      console.error('Failed to fetch status data:', error);
      
      // Return fallback data with all services operational
      const services: Service[] = STATUS_CONFIGS.map(config => ({
        name: config.name,
        status: 'operational',
        category: config.category,
        url: config.url,
      }));

      return {
        services,
        lastUpdated: new Date().toISOString(),
        overallStatus: 'operational'
      };
    }
  }

  async refreshStatus(): Promise<StatusResponse> {
    // Clear cache to force fresh data
    this.cache.clear();
    return this.getStatus();
  }

  // Get cached status immediately, then update in background
  async getStatusWithBackgroundUpdate(): Promise<StatusResponse> {
    const cachedServices: Service[] = [];
    const needsUpdate: typeof STATUS_CONFIGS = [];

    STATUS_CONFIGS.forEach(config => {
      const cached = this.cache.get(config.name);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        cachedServices.push(cached.data);
      } else {
        needsUpdate.push(config);
        // Add placeholder with operational status
        cachedServices.push({
          name: config.name,
          status: 'operational',
          category: config.category,
          url: config.url,
        });
      }
    });

    // Update needed services in background
    if (needsUpdate.length > 0) {
      Promise.all(needsUpdate.map(config => this.fetchServiceStatus(config)))
        .catch(console.error);
    }

    const degradedCount = cachedServices.filter(s => s.status === 'degraded').length;
    const outageCount = cachedServices.filter(s => s.status === 'outage').length;
    const maintenanceCount = cachedServices.filter(s => s.status === 'maintenance').length;
    
    let overallStatus: ServiceStatus = 'operational';
    if (outageCount > 0) overallStatus = 'outage';
    else if (degradedCount > 0) overallStatus = 'degraded';
    else if (maintenanceCount > 0) overallStatus = 'maintenance';

    return {
      services: cachedServices,
      lastUpdated: new Date().toISOString(),
      overallStatus
    };
  }

  private async fetchServiceIncidents(config: typeof STATUS_CONFIGS[0]): Promise<Incident[]> {
    if (!config.incidentsUrl) return [];

    try {
      const response = await axios.get(`${PROXY_URL}${encodeURIComponent(config.incidentsUrl)}`, {
        timeout: 10000,
      });
      
      let incidentsData;
      try {
        incidentsData = JSON.parse(response.data.contents);
      } catch {
        return [];
      }

      // Handle different incident API formats
      const incidents = incidentsData.incidents || incidentsData.data || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return incidents
        .filter((incident: any) => {
          const createdAt = new Date(incident.created_at);
          return createdAt >= today;
        })
        .map((incident: any) => ({
          id: incident.id,
          title: incident.name || incident.title,
          status: incident.status,
          impact: incident.impact || 'unknown',
          created_at: incident.created_at,
          updated_at: incident.updated_at,
          monitoring_at: incident.monitoring_at,
          resolved_at: incident.resolved_at,
          shortlink: incident.shortlink || config.url,
        }))
        .slice(0, 5); // Limit to 5 most recent incidents
    } catch (error) {
      console.warn(`Failed to fetch incidents for ${config.name}:`, error);
      return [];
    }
  }

  async getTodaysOutages(): Promise<{ service: string; category: string; incidents: Incident[] }[]> {
    try {
      const outagePromises = STATUS_CONFIGS.map(async config => {
        const incidents = await this.fetchServiceIncidents(config);
        const outageIncidents = incidents.filter(incident => 
          incident.impact === 'major' || 
          incident.impact === 'critical' || 
          incident.status === 'investigating' ||
          incident.status === 'identified' ||
          incident.status === 'monitoring'
        );
        
        return {
          service: config.name,
          category: config.category,
          incidents: outageIncidents
        };
      });

      const results = await Promise.all(outagePromises);
      return results.filter(result => result.incidents.length > 0);
    } catch (error) {
      console.error('Failed to fetch today\'s outages:', error);
      return [];
    }
  }

  async getAllTodaysIncidents(): Promise<{ service: string; category: string; incidents: Incident[] }[]> {
    try {
      const incidentPromises = STATUS_CONFIGS.map(async config => {
        const incidents = await this.fetchServiceIncidents(config);
        
        return {
          service: config.name,
          category: config.category,
          incidents
        };
      });

      const results = await Promise.all(incidentPromises);
      return results.filter(result => result.incidents.length > 0);
    } catch (error) {
      console.error('Failed to fetch today\'s incidents:', error);
      return [];
    }
  }
}

export const statusService = new StatusService();