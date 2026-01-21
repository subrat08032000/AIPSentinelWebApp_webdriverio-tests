import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';
import DashboardPage from '../pageobjects/dashboard.page.js';
import { getTestData } from '../utils/dynamicTestData.js';

describe('Dashboard Page Test Suite', () => {
    
    it('should verify dashboard elements after login', async () => {
        const testdata = getTestData();
        
        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        
        // Assuming login flow is required to reach dashboard
        // await LoginPage.login(testdata.Email, testdata.Password);
        
        // Placeholder verification
        // await expect(DashboardPage.dashboardHeader).toBeDisplayed();
    });
});
