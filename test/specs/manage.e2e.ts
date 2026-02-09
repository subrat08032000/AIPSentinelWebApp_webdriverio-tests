import LoginPage from '../pageobjects/login.page.js';
import ManagePage from '../pageobjects/manage.page.js';
import { getTestData } from '../utils/dynamicTestData.js';

describe('Manage Page - Approvals Verification', () => {
    const testdata = getTestData();

    before(async () => {
        await LoginPage.open(testdata.URL);
        await LoginPage.login_Manager(testdata.manager_username, testdata.Manager_password);
    });

    it('should click on Manage approval Button and see the Manager Approval header and list of managers for Approval or reject', async () => {
        await ManagePage.clickManageApprovals();
        
        // Verify Manager Approval header is displayed
        await ManagePage.managerApprovalheader.waitForDisplayed({ timeout: 15000 });
        await expect(ManagePage.managerApprovalheader).toBeDisplayed();
        
        // Verify manager approval table is displayed
        await ManagePage.managerApprovalTable.waitForDisplayed({ timeout: 15000 });
        await expect(ManagePage.managerApprovalTable).toBeDisplayed();

        // Check for manager names starting with "Test" and reject if found (handles multiples and verifies status)
        const rejected = await ManagePage.rejectManagersStartingWithPrefix('Test');
        if (rejected.length > 0) {
            console.log(`Successfully found and rejected ${rejected.length} manager(s) starting with "Test".`);
        } else {
            console.log('No manager starting with "Test" was found in the approval list.');
        }
    });
});
