import LoginPage from '../pageobjects/login.page.js';
import ManagePage from '../pageobjects/manage.page.js';
import { getTestData } from '../utils/dynamicTestData.js';

describe('[Manage005]Manage Page - Approvals Verification', () => {
    const testdata = getTestData();

    before(async () => {
        await LoginPage.open(testdata.URL);
        await LoginPage.login_Admin(testdata.Admin_Username, testdata.Admin_Password);
    });

    it('[TC014]Verify that the Manage User Page', async () => {
        await ManagePage.clickManageApprovals();
    });

    it('[TC015]Verify that Admin Should able to Approve User', async () => {
        await ManagePage.approveUsersStartingWithPrefix("Test", false);
    });
});
