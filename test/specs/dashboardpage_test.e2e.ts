import LoginPage from '../pageobjects/login.page.js';
import DashboardPage from '../pageobjects/dashboard.page.js';
import { getTestData } from '../utils/dynamicTestData.js';

describe('Dashboard Page Test Suite', () => {

    it('Verify that dashboard page asthetic are displaying as expected as Admin', async () => {
        const testdata = getTestData();

        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        await LoginPage.login_Admin(testdata.Admin_Username, testdata.Admin_Password);
        await DashboardPage.QueueManager();
        await DashboardPage.validateDashboardElementsDisplayed();
        await DashboardPage.InfraCat();
        await DashboardPage.validateAdminPanel_Dashboard();
    });

});
