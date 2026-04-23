import LoginPage from '../pageobjects/login.page.js';
import ApiPage from '../pageobjects/api.page.js';
import { getTestData } from '../utils/dynamicTestData.js';

describe('[API001]API Test Suite', () => {

    it('should fetch system overview data via API after UI login', async () => {
        const testdata = getTestData();

        // 1. Login via UI to establish session
        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        await LoginPage.login_Admin(testdata.Admin_Username, testdata.Admin_Password);

        // Wait for dashboard to ensure login is complete + cookies are set
        await browser.waitUntil(async () => {
             return (await browser.getUrl()).includes('dashboard');
        }, { timeout: 10000, timeoutMsg: 'Dashboard did not load' });

        // 2. Capture Cookies and Base URL
        const cookies = await browser.getCookies();
        const baseUrl = testdata.URL.replace(/\/$/, ''); // Remove trailing slash if present

        // Extract aip_access_token from cookies
        const tokenCookie = cookies.find(c => c.name === 'aip_access_token');
        const token = tokenCookie ? tokenCookie.value : undefined;

        if (!token) {
            throw new Error('aip_access_token not found in cookies');
        }

        // 3. Setup API Client
        await ApiPage.setupClient(baseUrl, cookies, token);

        // 4. Make API Call
        try {
            const response = await ApiPage.getSystemOverview();
            
            console.log('API Response Status:', response.status);
            console.log('API Response Data:', JSON.stringify(response.data, null, 2));

            // 5. Assertions
            expect(response.status).toBe(200);
            expect(response.data).toBeDefined();
            expect(response.data.data).toBeDefined();
            
            // Validate expected fields based on previous knowledge
            const data = response.data.data;
            expect(data).toHaveProperty('qms');
            expect(data).toHaveProperty('queues');
            expect(data).toHaveProperty('integrationServers');
            
        } catch (error: any) {
            console.error('API Call Failed:', error.message);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
            throw error;
        }
    });

});
