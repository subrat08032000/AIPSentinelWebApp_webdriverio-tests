import { $ } from '@wdio/globals';
import Page from './page.js';

class ManagePage extends Page {
    /**
     * define selectors using getter methods
     */
    public get ManageButton() {
        return $(`//span[text()='Manage']/ancestor::button | //span[text()='Manage']/ancestor::a`);
    }
    public get ManageOrganization() {
        return $(`//h1[normalize-space()='Manage Organization']`);
    }

    public get ManageApprovals() {
        return $(`//span[contains(text(), 'Manage Approvals')] | //span[contains(text(), 'Account Approvals')]`);
    }

    public get managerApprovalheader() {
        return $(`//h2[normalize-space()='Manager Approvals']`);
    }

    public get managerApprovalTable() {
        return $(`table`);
    }

    public get tableRows() {
        return $$(`table tbody tr`);
    }

    public get noUserRequestsFound() {
        return $(`//td[normalize-space()='No user requests found.']`);
    }

    public getRejectButtonInRow(row: WebdriverIO.Element) {
        return row.$(`.//td[8]//button[contains(text(),'Reject')]`);
    }

    public getTableRowByText(text: string) {
        return $(`//table/tbody/tr[contains(., '${text}')]`);
    }

    public getStatusByText(text: string) {
        // Status is the 7th column
        return $(`//table/tbody/tr[contains(., '${text}')]//td[7]`);
    }

    public async validateRowDisplay(row: WebdriverIO.Element) {
        const columns = await row.$$(`td`);
        // Expected at least 8 columns: Name, Email, Designation, Team, Phone, Requested At, Status, Actions
        await expect(columns.length).toBeGreaterThanOrEqual(8);
        for (let i = 0; i < 8; i++) {
            await expect(columns[i]).toBeDisplayed();
        }
    }

    public RejectRequest_popup(){
        return $(`(//h2[normalize-space()='Reject Request'])[1]`);
    }
    public get RejectRequest_popup_Reason(){
        return $(`//textarea[@placeholder='Reason (required)']`);
    }
    public get RejectRequest_Submit(){
        return $(`//button[normalize-space()='Confirm']`);
    }

    /**
     * navigation and interaction methods
     */
    public async clickManageApprovals() {
        await this.ManageButton.waitForClickable({ timeout: 15000 });
        await this.ManageButton.click();
        await this.ManageOrganization.waitForDisplayed({ timeout: 10000 });
        await this.ManageApprovals.waitForClickable({ timeout: 15000 });    
        await this.ManageApprovals.click();
    }

    public async rejectManagersStartingWithPrefix(prefix: string) {
        let found = true;
        const rejectedUsers: string[] = [];

        while (found) {
            found = false;
            const rows = await this.tableRows;
            
            for (const row of rows) {
                const rowText = await row.getText();
                const nameLine = rowText.split('\n')[0].trim();
                
                if (nameLine.startsWith(prefix)) {
                    // Validate row display before action
                    await this.validateRowDisplay(row);

                    const rejectBtn = await this.getRejectButtonInRow(row);
                    const statusCell = row.$(`.//td[7]`); 
                    
                    // Error handling: Check if status cell exists and is displayed
                    if (!(await statusCell.isExisting())) {
                        console.error(`ERROR: Status cell not found for row: ${nameLine}`);
                        continue;
                    }
                    if (!(await statusCell.isDisplayed())) {
                        console.error(`ERROR: Status cell is not displayed for row: ${nameLine}`);
                        continue;
                    }

                    // Get initial status before rejection
                    const initialStatus = await statusCell.getText();
                    console.log(`Initial status for ${nameLine}: ${initialStatus}`);
                    
                    if (await rejectBtn.isExisting() && await rejectBtn.isClickable()) {
                        await rejectBtn.scrollIntoView();
                        await rejectBtn.click();
                        
                        // Handle Popup
                        await this.RejectRequest_popup().waitForDisplayed({ timeout: 15000 });
                        await this.RejectRequest_popup_Reason.setValue('Rejecting for testing purpose');
                        await this.RejectRequest_Submit.waitForClickable({ timeout: 10000 });
                        await this.RejectRequest_Submit.click();
                        
                        // Error handling: Verify status change for this row with try-catch
                        try {
                            await browser.waitUntil(async () => {
                                const status = await statusCell.getText();
                                return status.toLowerCase().includes('reject');
                            }, {
                                timeout: 10000,
                                timeoutMsg: `Status for ${nameLine} did not change to Rejected`
                            });
                            
                            const finalStatus = await statusCell.getText();
                            console.log(`SUCCESS: Status changed from '${initialStatus}' to '${finalStatus}' for ${nameLine}`);
                            rejectedUsers.push(nameLine);
                        } catch (error) {
                            const currentStatus = await statusCell.getText();
                            console.error(`ERROR: Status validation failed for ${nameLine}. Current status: '${currentStatus}'. Expected: 'Rejected'`);
                            console.error(`Error details: ${error}`);
                            // Continue to next row instead of failing the entire test
                        }
                        
                        // Wait briefly for UI to stabilize and break to re-fetch rows
                        await browser.pause(2000); 
                        found = true;
                        break; 
                    }
                }
            }
        }

        console.log('==============================');
        console.log(`Total Rejected Managers: ${rejectedUsers.length}`);
        console.log('Rejected List:', rejectedUsers);
        console.log('==============================');
        
        return rejectedUsers;
    }
}

export default new ManagePage();
