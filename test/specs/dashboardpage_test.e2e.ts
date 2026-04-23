import LoginPage from '../pageobjects/login.page.js';
import DashboardPage from '../pageobjects/dashboard.page.js';
import { getTestData } from '../utils/dynamicTestData.js';

describe('[Dashboard003]Dashboard Page Test Suite', () => {

    it('[01]Verify that dashboard page asthetic are displaying as expected as Admin', async () => {
        const testdata = getTestData();

        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        await LoginPage.login_Admin(testdata.Admin_Username, testdata.Admin_Password);
        await DashboardPage.QueueManager();
        await DashboardPage.validateDashboardElementsDisplayed();
        await DashboardPage.InfraCat();
        await DashboardPage.validateAdminPanel_Dashboard();
        await DashboardPage.DashboardActive_Alerts_Validation();
    });
    it('[02]Verify that dashboard page asthetic are displaying as expected as Manager', async () => {
        const testdata = getTestData();

        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        await LoginPage.login_Manager(testdata.manager_username, testdata.Manager_password);
        await DashboardPage.QueueManager();
        await DashboardPage.validateDashboardElementsDisplayed();
        await DashboardPage.InfraCat();
        await DashboardPage.validateManagerTools_Dashboard();
        await DashboardPage.DashboardActive_Alerts_Validation();
    });
    it('[03]Verify that dashboard page asthetic are displaying as expected as User', async () => {
        const testdata = getTestData();

        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        await LoginPage.login_User(testdata.User_Username, testdata.User_Password);
        await DashboardPage.QueueManager();
        await DashboardPage.validateDashboardElementsDisplayed();
        await DashboardPage.InfraCat();
        await DashboardPage.validateUserDashboard_Aesthetics();
        await DashboardPage.DashboardActive_Alerts_Validation_User();
    });

});
