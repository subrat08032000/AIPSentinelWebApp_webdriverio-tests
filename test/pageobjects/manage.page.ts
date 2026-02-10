import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
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
        return $(`//h2[contains(., 'Manager Approvals')]/following-sibling::div//table | //table[contains(., 'Manager Name')] | (//table[@class='w-full caption-bottom text-sm'])[1]`);
    }

    public get managertableRows() {
        return this.managerApprovalTable.$$(`tbody tr`);
    }

    public get tableRows() {
        return this.managertableRows;
    }

    public get userApprovalTable() {
        return $(`//h2[contains(., 'User Approvals')]/following-sibling::div//table | //table[contains(., 'User Name')] | (//table[@class='w-full caption-bottom text-sm'])[2]`);
    }

    public get usertableRows() {
        return this.userApprovalTable.$$(`tbody tr`);
    }

    public get noUserRequestsFound() {
        return $(`//td[normalize-space()='No user requests found.']`);
    }

    public get noManagerRequestsFound() {
        return $(`//td[normalize-space()='No manager requests found.']`);
    }

    public getRejectButtonInRow(row: WebdriverIO.Element | ChainablePromiseElement) {
        // Try multiple strategies to find the Reject button
        return row.$(`.//button[normalize-space()='Reject'] | .//button[contains(.,'Reject')]`);
    }

    public getManagerTableRowByText(text: string) {
        // Try searching within the specific table first, then global as fallback
        return this.managerApprovalTable.$(`.//tr[contains(., '${text}')]`);
    }

    public getUserTableRowByText(text: string) {
        // Try searching within the specific table first, then global as fallback
        return this.userApprovalTable.$(`.//tr[contains(., '${text}')]`);
    }

    public getStatusByText(text: string) {
        // Status is the 7th column
        return $(`//table/tbody/tr[contains(., '${text}')]//td[7]`);
    }

    public async validateRowDisplay(row: WebdriverIO.Element | ChainablePromiseElement, namePrefix: string): Promise<boolean> {
        const columns = await row.$$('td');
        const colCount = await columns.length; 
        
        // If it's a message row (like "No records found") or otherwise not a data row
        if (colCount < 8) {
            return false;
        }
        
        const nameText = (await columns[0].getText()).trim();
        if (!nameText.startsWith(namePrefix)) {
            return false;
        }

        // Validate other fields have data (Email, Designation, Team)
        for (let i = 1; i < 4; i++) {
            const text = (await columns[i].getText()).trim();
            if (text === "") {
                throw new Error(`Validation Error: Column ${i} is empty for user ${nameText}`);
            }
        }
        return true;
    }

    public get RejectRequest_popup(){
        return $(`(//h2[normalize-space()='Reject Request'])[1]`);
    }
    public get RejectRequest_popup_Reason(){
        return $(`//textarea[@placeholder='Reason (required)']`);
    }
    public get RejectRequest_Submit(){
        return $(`//button[normalize-space()='Confirm']`);
    }
    public get UserApproval_header(){
        return $("//h2[normalize-space()='User Approvals']")
    }
    public get UserApprovaltable(){
        return $("(//table[@class='w-full caption-bottom text-sm'])[2]")
    }
    public get UserRejectButton(){
        return $(`//h2[normalize-space()='User Approvals']/following-sibling::div//table//button[normalize-space()='Reject']`);
    }
    public get UserApproveButton(){
        return $("(//button[normalize-space()='Approve'])[1]")
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

    public async rejectManagersStartingWithPrefix(prefix: string, shouldVerifyEmpty: boolean = true) {
        let iterations = 0;
        const maxIterations = 50; // Safety break
        const rejectedUsers: string[] = [];

        console.log(`[DEBUG] Starting rejection for managers with prefix: "${prefix}"`);

        // Explicitly scroll to Manager Approval section first
        await this.managerApprovalheader.scrollIntoView({ block: 'center' });
        await browser.pause(1000);

        while (iterations < maxIterations) {
            iterations++;
            let currentMatchIndex = -1;
            
            let rows = await this.managertableRows;
            let rowsCount = await rows.length;
            
            // If No rows found on first try, try a soft refresh by clicking the menu again
            if (iterations === 1 && rowsCount === 0) {
                 console.log(`[DEBUG] No manager rows found on first try. Attempting table refresh...`);
                 await this.ManageApprovals.click();
                 await browser.pause(2000);
                 rows = await this.managertableRows;
                 rowsCount = await rows.length;
            }

            console.log(`[DEBUG] Iteration ${iterations}: Found ${rowsCount} total rows in manager table.`);

            for (let i = 0; i < rowsCount; i++) {
                const row = rows[i];
                if (!(await row.isExisting())) continue;

                const columns = await row.$$('td');
                const colCount = await columns.length;
                if (colCount < 2) continue;

                const nameText = (await columns[0].getText()).trim();
                const statusCell = columns[colCount - 2]; 
                const status = (await statusCell.getText()).toLowerCase().trim();

                console.log(`[DEBUG] Analyzing Row ${i}: Name="${nameText}", Status="${status}"`);

                // Case-insensitive prefix match
                if (nameText.toLowerCase().startsWith(prefix.toLowerCase()) && 
                    (status.includes('pending') || status.includes('renew'))) {
                    console.log(`[DEBUG] !!! MATCH FOUND !!! at row ${i}: "${nameText}"`);
                    currentMatchIndex = i;
                    break;
                }
            }

            if (currentMatchIndex === -1) {
                console.log(`[DEBUG] No more matching pending managers found in iteration ${iterations}.`);
                break;
            }

            // Perform rejection on the found match
            const matchingRow = rows[currentMatchIndex];
            const matchingColumns = await matchingRow.$$('td');
            const matchingNameText = (await matchingColumns[0].getText()).trim();
            
            console.log(`[DEBUG] Action: Rejecting manager "${matchingNameText}"...`);
            const rejectBtn = await this.getRejectButtonInRow(matchingRow);
            await rejectBtn.scrollIntoView({ block: 'center' });
            await rejectBtn.click();
            
            await this.RejectRequest_popup.waitForDisplayed({ timeout: 10000 });
            await this.RejectRequest_popup_Reason.setValue('Rejecting for testing purpose');
            await this.RejectRequest_Submit.click();
            
            // Wait for popup to disappear
            await this.RejectRequest_popup.waitForDisplayed({ timeout: 10000, reverse: true });
            
            console.log(`[DEBUG] Waiting for status change for ${matchingNameText}...`);
            await browser.waitUntil(async () => {
                // Re-find the row by text to avoid stale element issues
                const updatedRow = await this.getManagerTableRowByText(matchingNameText);
                if (!(await updatedRow.isExisting())) return true; // Might have disappeared if table refreshed

                const columns = await updatedRow.$$('td');
                const colCount = await columns.length;
                if (colCount < 2) return false;
                
                const currentStatus = (await columns[colCount - 2].getText()).toLowerCase();
                return currentStatus.includes('reject');
            }, {
                timeout: 10000,
                timeoutMsg: `Status for ${matchingNameText} did not change to Rejected.`
            });
            
            console.log(`SUCCESS: Rejected manager ${matchingNameText}`);
            rejectedUsers.push(matchingNameText);
            
            // Short pause to allow UI to settle before next iteration
            await browser.pause(1000);
        }

        if (shouldVerifyEmpty) {
            console.log(`[DEBUG] Verifying table status for prefix "${prefix}"...`);
            
            const rows = await this.managertableRows;
            const rowsCount = await rows.length;
            for (let i = 0; i < rowsCount; i++) {
                const row = rows[i];
                const columns = await row.$$('td');
                const colCount = await columns.length;
                if (colCount >= 2) {
                    const nameText = (await columns[0].getText()).trim();
                    if (nameText.startsWith(prefix)) {
                        const status = (await columns[colCount - 2].getText()).toLowerCase();
                        if (status.includes('pending')) {
                            throw new Error(`Verification Failed: Found pending manager ${nameText} after rejection process.`);
                        }
                    }
                }
            }
            console.log(`[DEBUG] Verification complete.`);
        }
        
        console.log('==============================');
        console.log(`Total Rejected Managers: ${rejectedUsers.length}`);
        console.log('Rejected List:', rejectedUsers);
        console.log('==============================');
        
        return rejectedUsers;
    }

    public async rejectUsersStartingWithPrefix(prefix: string, shouldVerifyEmpty: boolean = true) {
        let iterations = 0;
        const maxIterations = 50;
        const rejectedUsers: string[] = [];

        console.log(`[DEBUG] Starting rejection for users with prefix: "${prefix}"`);

        // Explicitly scroll to User Approval section first
        await this.UserApproval_header.scrollIntoView({ block: 'center' });
        await browser.pause(1000);

        while (iterations < maxIterations) {
            iterations++;
            let currentMatchIndex = -1;
            
            let rows = await this.usertableRows;
            let rowsCount = await rows.length;
            
            // If No matches on first iteration, try refreshing once
            if (iterations === 1 && rowsCount === 0) {
                 console.log(`[DEBUG] No rows found on first try. Refreshing page...`);
                 await browser.refresh();
                 await this.ManageApprovals.waitForDisplayed();
                 await this.ManageApprovals.click();
                 await browser.pause(2000);
                 rows = await this.usertableRows;
                 rowsCount = await rows.length;
            }

            console.log(`[DEBUG] Iteration ${iterations}: Found ${rowsCount} total rows in user table.`);

            for (let i = 0; i < rowsCount; i++) {
                const row = rows[i];
                if (!(await row.isExisting())) continue;

                const columns = await row.$$('td');
                const colCount = await columns.length;
                if (colCount < 2) continue;

                const nameText = (await columns[0].getText()).trim();
                const statusCell = columns[colCount - 2]; 
                const status = (await statusCell.getText()).toLowerCase().trim();

                console.log(`[DEBUG] Analyzing Row ${i}: Name="${nameText}", Status="${status}"`);

                // Case-insensitive prefix match
                if (nameText.toLowerCase().startsWith(prefix.toLowerCase()) && 
                    (status.includes('pending') || status.includes('renew'))) {
                    console.log(`[DEBUG] !!! MATCH FOUND !!! at row ${i}: "${nameText}"`);
                    currentMatchIndex = i;
                    break;
                }
            }

            if (currentMatchIndex === -1) {
                console.log(`[DEBUG] No more matching pending users found in iteration ${iterations}.`);
                break;
            }

            const matchingRow = rows[currentMatchIndex];
            const matchingColumns = await matchingRow.$$('td');
            const matchingNameText = (await matchingColumns[0].getText()).trim();
            
            console.log(`[DEBUG] Action: Rejecting user "${matchingNameText}"...`);
            const rejectBtn = await this.getRejectButtonInRow(matchingRow);
            await rejectBtn.scrollIntoView({ block: 'center' });
            await rejectBtn.click();
            
            await this.RejectRequest_popup.waitForDisplayed({ timeout: 10000 });
            await this.RejectRequest_popup_Reason.setValue('Rejecting for testing purpose');
            await this.RejectRequest_Submit.click();
            
            await this.RejectRequest_popup.waitForDisplayed({ timeout: 10000, reverse: true });
            
            console.log(`[DEBUG] Waiting for status change for user ${matchingNameText}...`);
            await browser.waitUntil(async () => {
                // For users, we must check the user table specifically
                const updatedRow = await this.getUserTableRowByText(matchingNameText);
                if (!(await updatedRow.isExisting())) return true;

                const columns = await updatedRow.$$('td');
                const colCount = await columns.length;
                if (colCount < 2) return false;
                
                const currentStatus = (await columns[colCount - 2].getText()).toLowerCase();
                return currentStatus.includes('reject');
            }, {
                timeout: 10000,
                timeoutMsg: `Status for user ${matchingNameText} did not change to Rejected.`
            });
            
            console.log(`SUCCESS: Rejected user ${matchingNameText}`);
            rejectedUsers.push(matchingNameText);
            await browser.pause(1000);
        }

        if (shouldVerifyEmpty) {
            console.log(`[DEBUG] Verifying user table status for prefix "${prefix}"...`);
            
            const rows = await this.usertableRows;
            const rowsCount = await rows.length;
            for (let i = 0; i < rowsCount; i++) {
                const row = rows[i];
                const columns = await row.$$('td');
                const colCount = await columns.length;
                if (colCount >= 2) {
                    const nameText = (await columns[0].getText()).trim();
                    if (nameText.startsWith(prefix)) {
                        const status = (await columns[colCount - 2].getText()).toLowerCase();
                        if (status.includes('pending')) {
                            throw new Error(`Verification Failed: Found pending user ${nameText} after rejection process.`);
                        }
                    }
                }
            }
            console.log(`[DEBUG] User verification complete.`);
        }

        console.log('==============================');
        console.log(`Total Rejected Users: ${rejectedUsers.length}`);
        console.log('Rejected List:', rejectedUsers);
        console.log('==============================');
        
        return rejectedUsers;
    }
}

export default new ManagePage();
