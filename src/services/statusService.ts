import axios from 'axios';
import { StatusResponse, Service, ServiceStatus } from '../types/status';

// Real status page configurations
const STATUS_CONFIGS = [
  // Cloud Providers
  { name: 'AWS', category: 'Cloud Providers', url: 'https://status.aws.amazon.com/', statusUrl: 'https://status.aws.amazon.com/rss/all.rss' },
  { name: 'Google Cloud', category: 'Cloud Providers', url: 'https://status.cloud.google.com/', statusUrl: 'https://status.cloud.google.com/incidents.json' },
  { name: 'Microsoft Azure', category: 'Cloud Providers', url: 'https://status.azure.com/', statusUrl: 'https://status.azure.com/en-us/status/feed/' },
  { name: 'DigitalOcean', category: 'Cloud Providers', url: 'https://status.digitalocean.com/', statusUrl: 'https://status.digitalocean.com/api/v2/status.json' },
  { name: 'Linode', category: 'Cloud Providers', url: 'https://status.linode.com/', statusUrl: 'https://status.linode.com/api/v2/status.json' },
  { name: 'Vultr', category: 'Cloud Providers', url: 'https://status.vultr.com/', statusUrl: 'https://status.vultr.com/api/v2/status.json' },
  
  // AI/ML Services
  { name: 'OpenAI', category: 'AI/ML Services', url: 'https://status.openai.com/', statusUrl: 'https://status.openai.com/api/v2/status.json' },
  { name: 'Anthropic', category: 'AI/ML Services', url: 'https://status.anthropic.com/', statusUrl: 'https://status.anthropic.com/api/v2/status.json' },
  { name: 'Hugging Face', category: 'AI/ML Services', url: 'https://status.huggingface.co/', statusUrl: 'https://status.huggingface.co/api/v2/status.json' },
  { name: 'Replicate', category: 'AI/ML Services', url: 'https://status.replicate.com/', statusUrl: 'https://status.replicate.com/api/v2/status.json' },
  { name: 'Cohere', category: 'AI/ML Services', url: 'https://status.cohere.ai/', statusUrl: 'https://status.cohere.ai/api/v2/status.json' },
  
  // Development Tools
  { name: 'GitHub', category: 'Development Tools', url: 'https://www.githubstatus.com/', statusUrl: 'https://www.githubstatus.com/api/v2/status.json' },
  { name: 'GitLab', category: 'Development Tools', url: 'https://status.gitlab.com/', statusUrl: 'https://status.gitlab.com/api/v2/status.json' },
  { name: 'Vercel', category: 'Development Tools', url: 'https://www.vercel-status.com/', statusUrl: 'https://www.vercel-status.com/api/v2/status.json' },
  { name: 'Netlify', category: 'Development Tools', url: 'https://www.netlifystatus.com/', statusUrl: 'https://www.netlifystatus.com/api/v2/status.json' },
  { name: 'Heroku', category: 'Development Tools', url: 'https://status.heroku.com/', statusUrl: 'https://status.heroku.com/api/v2/status.json' },
  { name: 'Railway', category: 'Development Tools', url: 'https://status.railway.app/', statusUrl: 'https://status.railway.app/api/v2/status.json' },
  { name: 'Render', category: 'Development Tools', url: 'https://status.render.com/', statusUrl: 'https://status.render.com/api/v2/status.json' },
  
  // Databases
  { name: 'MongoDB Atlas', category: 'Databases', url: 'https://status.mongodbstatus.com/', statusUrl: 'https://status.mongodbstatus.com/api/v2/status.json' },
  { name: 'Supabase', category: 'Databases', url: 'https://status.supabase.com/', statusUrl: 'https://status.supabase.com/api/v2/status.json' },
  { name: 'PlanetScale', category: 'Databases', url: 'https://www.planetscalestatus.com/', statusUrl: 'https://www.planetscalestatus.com/api/v2/status.json' },
  { name: 'Firebase', category: 'Databases', url: 'https://status.firebase.google.com/', statusUrl: 'https://status.firebase.google.com/incidents.json' },
  { name: 'Redis Cloud', category: 'Databases', url: 'https://status.redislabs.com/', statusUrl: 'https://status.redislabs.com/api/v2/status.json' },
  { name: 'Fauna', category: 'Databases', url: 'https://status.fauna.com/', statusUrl: 'https://status.fauna.com/api/v2/status.json' },
  
  // Monitoring
  { name: 'Datadog', category: 'Monitoring', url: 'https://status.datadoghq.com/', statusUrl: 'https://status.datadoghq.com/api/v2/status.json' },
  { name: 'New Relic', category: 'Monitoring', url: 'https://status.newrelic.com/', statusUrl: 'https://status.newrelic.com/api/v2/status.json' },
  { name: 'Sentry', category: 'Monitoring', url: 'https://status.sentry.io/', statusUrl: 'https://status.sentry.io/api/v2/status.json' },
  { name: 'LogRocket', category: 'Monitoring', url: 'https://status.logrocket.com/', statusUrl: 'https://status.logrocket.com/api/v2/status.json' },
  { name: 'Pingdom', category: 'Monitoring', url: 'https://status.pingdom.com/', statusUrl: 'https://status.pingdom.com/api/v2/status.json' },
  
  // CDN
  { name: 'Cloudflare', category: 'CDN', url: 'https://www.cloudflarestatus.com/', statusUrl: 'https://www.cloudflarestatus.com/api/v2/status.json' },
  { name: 'Fastly', category: 'CDN', url: 'https://status.fastly.com/', statusUrl: 'https://status.fastly.com/api/v2/status.json' },
  { name: 'KeyCDN', category: 'CDN', url: 'https://status.keycdn.com/', statusUrl: 'https://status.keycdn.com/api/v2/status.json' },
  
  // Communication
  { name: 'Slack', category: 'Communication', url: 'https://status.slack.com/', statusUrl: 'https://status.slack.com/api/v2/status.json' },
  { name: 'Discord', category: 'Communication', url: 'https://discordstatus.com/', statusUrl: 'https://discordstatus.com/api/v2/status.json' },
  { name: 'Zoom', category: 'Communication', url: 'https://status.zoom.us/', statusUrl: 'https://status.zoom.us/api/v2/status.json' },
  { name: 'Twilio', category: 'Communication', url: 'https://status.twilio.com/', statusUrl: 'https://status.twilio.com/api/v2/status.json' },
  { name: 'SendGrid', category: 'Communication', url: 'https://status.sendgrid.com/', statusUrl: 'https://status.sendgrid.com/api/v2/status.json' },
  
  // Payment
  { name: 'Stripe', category: 'Payment', url: 'https://status.stripe.com/', statusUrl: 'https://status.stripe.com/api/v2/status.json' },
  { name: 'PayPal', category: 'Payment', url: 'https://www.paypal-status.com/', statusUrl: 'https://www.paypal-status.com/api/v2/status.json' },
  { name: 'Square', category: 'Payment', url: 'https://status.squareup.com/', statusUrl: 'https://status.squareup.com/api/v2/status.json' },
  
  // Security
  { name: 'Auth0', category: 'Security', url: 'https://status.auth0.com/', statusUrl: 'https://status.auth0.com/api/v2/status.json' },
  { name: 'Okta', category: 'Security', url: 'https://status.okta.com/', statusUrl: 'https://status.okta.com/api/v2/status.json' },
  { name: 'Clerk', category: 'Security', url: 'https://status.clerk.com/', statusUrl: 'https://status.clerk.com/api/v2/status.json' },
  
  // Analytics
  { name: 'Google Analytics', category: 'Analytics', url: 'https://www.google.com/appsstatus/', statusUrl: 'https://www.google.com/appsstatus/rss/en' },
  { name: 'Mixpanel', category: 'Analytics', url: 'https://status.mixpanel.com/', statusUrl: 'https://status.mixpanel.com/api/v2/status.json' },
  { name: 'Amplitude', category: 'Analytics', url: 'https://status.amplitude.com/', statusUrl: 'https://status.amplitude.com/api/v2/status.json' },
  
  // Storage
  { name: 'Amazon S3', category: 'Storage', url: 'https://status.aws.amazon.com/', statusUrl: 'https://status.aws.amazon.com/rss/s3-us-east-1.rss' },
  { name: 'Dropbox', category: 'Storage', url: 'https://status.dropbox.com/', statusUrl: 'https://status.dropbox.com/api/v2/status.json' },
  { name: 'Google Drive', category: 'Storage', url: 'https://www.google.com/appsstatus/', statusUrl: 'https://www.google.com/appsstatus/rss/en' },
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
}

export const statusService = new StatusService();