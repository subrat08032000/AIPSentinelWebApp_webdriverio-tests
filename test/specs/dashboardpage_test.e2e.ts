import LoginPage from '../pageobjects/login.page.js';
import DashboardPage from '../pageobjects/dashboard.page.js';
import { getTestData } from '../utils/dynamicTestData.js';

describe('Dashboard Page Test Suite', () => {

    it('should verify dashboard elements are displayed after login', async () => {
        const testdata = getTestData();

        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        await LoginPage.login_Admin(testdata.Admin_Username, testdata.Admin_Password);
        await DashboardPage.QueueManager();
        await DashboardPage.validateDashboardElementsDisplayed();
        await DashboardPage.InfraCat();
    });

});
