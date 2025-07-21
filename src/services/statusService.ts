import axios from 'axios';
import { StatusResponse, Service } from '../types/status';

// Mock data for development - replace with actual API endpoint
const MOCK_SERVICES: Service[] = [
  // Cloud Providers
  { name: 'AWS', status: 'operational', category: 'Cloud Providers', url: 'https://status.aws.amazon.com/' },
  { name: 'Google Cloud', status: 'operational', category: 'Cloud Providers', url: 'https://status.cloud.google.com/' },
  { name: 'Microsoft Azure', status: 'operational', category: 'Cloud Providers', url: 'https://status.azure.com/' },
  { name: 'DigitalOcean', status: 'operational', category: 'Cloud Providers', url: 'https://status.digitalocean.com/' },
  { name: 'Linode', status: 'operational', category: 'Cloud Providers', url: 'https://status.linode.com/' },
  { name: 'Vultr', status: 'operational', category: 'Cloud Providers', url: 'https://status.vultr.com/' },
  
  // AI/ML Services
  { name: 'OpenAI', status: 'operational', category: 'AI/ML Services', url: 'https://status.openai.com/' },
  { name: 'Anthropic', status: 'operational', category: 'AI/ML Services', url: 'https://status.anthropic.com/' },
  { name: 'Hugging Face', status: 'operational', category: 'AI/ML Services', url: 'https://status.huggingface.co/' },
  { name: 'Replicate', status: 'operational', category: 'AI/ML Services', url: 'https://status.replicate.com/' },
  { name: 'Cohere', status: 'operational', category: 'AI/ML Services', url: 'https://status.cohere.ai/' },
  
  // Development Tools
  { name: 'GitHub', status: 'operational', category: 'Development Tools', url: 'https://www.githubstatus.com/' },
  { name: 'GitLab', status: 'operational', category: 'Development Tools', url: 'https://status.gitlab.com/' },
  { name: 'Vercel', status: 'operational', category: 'Development Tools', url: 'https://www.vercel-status.com/' },
  { name: 'Netlify', status: 'operational', category: 'Development Tools', url: 'https://www.netlifystatus.com/' },
  { name: 'Heroku', status: 'operational', category: 'Development Tools', url: 'https://status.heroku.com/' },
  { name: 'Railway', status: 'operational', category: 'Development Tools', url: 'https://status.railway.app/' },
  { name: 'Render', status: 'operational', category: 'Development Tools', url: 'https://status.render.com/' },
  
  // Databases
  { name: 'MongoDB Atlas', status: 'operational', category: 'Databases', url: 'https://status.mongodbstatus.com/' },
  { name: 'Supabase', status: 'operational', category: 'Databases', url: 'https://status.supabase.com/' },
  { name: 'PlanetScale', status: 'operational', category: 'Databases', url: 'https://www.planetscalestatus.com/' },
  { name: 'Firebase', status: 'operational', category: 'Databases', url: 'https://status.firebase.google.com/' },
  { name: 'Redis Cloud', status: 'operational', category: 'Databases', url: 'https://status.redislabs.com/' },
  { name: 'Fauna', status: 'operational', category: 'Databases', url: 'https://status.fauna.com/' },
  
  // Monitoring
  { name: 'Datadog', status: 'operational', category: 'Monitoring', url: 'https://status.datadoghq.com/' },
  { name: 'New Relic', status: 'operational', category: 'Monitoring', url: 'https://status.newrelic.com/' },
  { name: 'Sentry', status: 'operational', category: 'Monitoring', url: 'https://status.sentry.io/' },
  { name: 'LogRocket', status: 'operational', category: 'Monitoring', url: 'https://status.logrocket.com/' },
  { name: 'Pingdom', status: 'operational', category: 'Monitoring', url: 'https://status.pingdom.com/' },
  
  // CDN
  { name: 'Cloudflare', status: 'operational', category: 'CDN', url: 'https://www.cloudflarestatus.com/' },
  { name: 'Fastly', status: 'operational', category: 'CDN', url: 'https://status.fastly.com/' },
  { name: 'KeyCDN', status: 'operational', category: 'CDN', url: 'https://status.keycdn.com/' },
  
  // Communication
  { name: 'Slack', status: 'operational', category: 'Communication', url: 'https://status.slack.com/' },
  { name: 'Discord', status: 'operational', category: 'Communication', url: 'https://discordstatus.com/' },
  { name: 'Zoom', status: 'operational', category: 'Communication', url: 'https://status.zoom.us/' },
  { name: 'Twilio', status: 'operational', category: 'Communication', url: 'https://status.twilio.com/' },
  { name: 'SendGrid', status: 'operational', category: 'Communication', url: 'https://status.sendgrid.com/' },
  
  // Payment
  { name: 'Stripe', status: 'operational', category: 'Payment', url: 'https://status.stripe.com/' },
  { name: 'PayPal', status: 'operational', category: 'Payment', url: 'https://www.paypal-status.com/' },
  { name: 'Square', status: 'operational', category: 'Payment', url: 'https://status.squareup.com/' },
  
  // Security
  { name: 'Auth0', status: 'operational', category: 'Security', url: 'https://status.auth0.com/' },
  { name: 'Okta', status: 'operational', category: 'Security', url: 'https://status.okta.com/' },
  { name: 'Clerk', status: 'operational', category: 'Security', url: 'https://status.clerk.com/' },
  
  // Analytics
  { name: 'Google Analytics', status: 'operational', category: 'Analytics', url: 'https://www.google.com/appsstatus/' },
  { name: 'Mixpanel', status: 'operational', category: 'Analytics', url: 'https://status.mixpanel.com/' },
  { name: 'Amplitude', status: 'operational', category: 'Analytics', url: 'https://status.amplitude.com/' },
  
  // Storage
  { name: 'Amazon S3', status: 'operational', category: 'Storage', url: 'https://status.aws.amazon.com/' },
  { name: 'Dropbox', status: 'operational', category: 'Storage', url: 'https://status.dropbox.com/' },
  { name: 'Google Drive', status: 'operational', category: 'Storage', url: 'https://www.google.com/appsstatus/' },
];

class StatusService {
  private baseUrl = 'http://localhost:5000/api'; // Replace with your Flask backend URL
  private useMockData = true; // Set to false when backend is available

  async getStatus(): Promise<StatusResponse> {
    if (this.useMockData) {
      // Simulate some services with different statuses for demo
      const services = MOCK_SERVICES.map((service, index) => {
        if (index % 15 === 0) return { ...service, status: 'degraded' as const };
        if (index % 20 === 0) return { ...service, status: 'maintenance' as const };
        if (index % 25 === 0) return { ...service, status: 'outage' as const };
        return service;
      });

      const degradedCount = services.filter(s => s.status === 'degraded').length;
      const outageCount = services.filter(s => s.status === 'outage').length;
      
      let overallStatus: 'operational' | 'degraded' | 'outage' | 'maintenance' = 'operational';
      if (outageCount > 0) overallStatus = 'outage';
      else if (degradedCount > 0) overallStatus = 'degraded';

      return {
        services,
        lastUpdated: new Date().toISOString(),
        overallStatus
      };
    }

    try {
      const response = await axios.get(`${this.baseUrl}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch status:', error);
      // Fallback to mock data
      return this.getStatus();
    }
  }

  async refreshStatus(): Promise<StatusResponse> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return this.getStatus();
  }
}

export const statusService = new StatusService();