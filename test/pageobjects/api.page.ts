import axios, { AxiosInstance, AxiosResponse } from 'axios';
import https from 'https';

class ApiPage {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            httpsAgent: new https.Agent({  
                rejectUnauthorized: false
            })
        });
    }

    /**
     * Updates the Axios client instance with the base URL, cookies, and Authorization header.
     * @param baseUrl The base URL of the application
     * @param cookies Array of cookies from the browser
     * @param token Optional Bearer token
     */
    public async setupClient(baseUrl: string, cookies: any[], token?: string) {
        const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
        
        this.client.defaults.baseURL = baseUrl;
        this.client.defaults.headers.common['Cookie'] = cookieHeader;

        if (token) {
            this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }

    /**
     * Fetches the system overview data.
     * Endpoint: /api/v1/dashboard/system_overview?env=ALL
     */
    public async getSystemOverview(): Promise<AxiosResponse> {
        return this.client.get('/api/v1/dashboard/system_overview?env=ALL');
    }

    /**
     * Fetches the down components data.
     * Endpoint: /api/v1/dashboard/down_components?env=ALL
     */
    public async getDownComponents(env: string = 'ALL'): Promise<AxiosResponse> {
        return this.client.get(`/api/v1/dashboard/down_components?env=${env}`);
    }

    /**
     * Fetches all alerts.
     * Endpoint: /api/v1/alerts/displayAllAlerts
     */
    public async displayAllAlerts(data: any = {}): Promise<AxiosResponse> {
        return this.client.post('/api/v1/alerts/displayAllAlerts', data);
    }

    /**
     * Fetches active QMs data.
     * Endpoint: /api/v1/mq/getActiveQms?env=ALL
     */
    public async getActiveQms(env: string = 'ALL'): Promise<AxiosResponse> {
        return this.client.get(`/api/v1/mq/getActiveQms?env=${env}`);
    }

    /**
     * Fetches all ACE servers data.
     * Endpoint: /api/v1/ace/getAllServers?env=ALL
     */
    public async getAllServers(env: string = 'ALL'): Promise<AxiosResponse> {
        return this.client.get(`/api/v1/ace/getAllServers?env=${env}`);
    }
    /**
     * Fetches all Custom Applications data.
     * Endpoint: /api/v1/extapps/getAllJarApplications?env=ALL
     */
    public async getAllJarApplications(env: string = 'ALL'): Promise<AxiosResponse> {
        return this.client.get(`/api/v1/extapps/getAllJarApplications?env=${env}`);
    }
}

export default new ApiPage();
