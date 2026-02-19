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
        return $(`//h1[normalize-space()='Manage Organization'] | //*[normalize-space()='My Team'] | //*[normalize-space()='My Teams']`);
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

    public async getApproveButtonInRow(row: WebdriverIO.Element | ChainablePromiseElement) {
        // Resolve the row promise to ensure we operate on an actual Element
        const resolvedRow = await row as WebdriverIO.Element;
        console.log(`[DEBUG] getApproveButtonInRow: Inspecting row for Approve button...`);
        
        // Debug: Print row HTML to understand structure
        try {
            const rowHTML = await resolvedRow.getHTML();
            console.log(`[DEBUG] Row HTML: ${rowHTML.substring(0, 500)}...`); // Log first 500 chars
        } catch (e) {
            console.log(`[DEBUG] Could not get row HTML: ${e}`);
        }

        // Strategy 1: Explicit text match
        const approveBtn = await resolvedRow.$(`.//button[normalize-space()='Approve']`);
        if (await approveBtn.isExisting()) {
            const text = await approveBtn.getText();
            console.log(`[DEBUG] Strategy 1 found button with text: "${text}"`);
            if (text.trim() === 'Approve') {
                return approveBtn;
            }
        } else {
            console.log(`[DEBUG] Strategy 1 (XPath .//button[normalize-space()='Approve']) found NOTHING.`);
        }

        // Strategy 2: Iterate all buttons
        console.log(`[DEBUG] Strategy 2: Iterating all buttons in row...`);
        const buttons = await resolvedRow.$$('button');
        const btnCount = await buttons.length;
        console.log(`[DEBUG] Found ${btnCount} buttons in this row.`);
        
        for (let i = 0; i < btnCount; i++) {
            const btn = buttons[i];
            const text = await btn.getText();
            console.log(`[DEBUG] Button ${i} text: "${text}"`);
            
            // Check for 'Approve' and ensure it's not 'Reject'
            if (text.trim() === 'Approve' && !text.includes('Reject')) {
                console.log(`[DEBUG] Match found at index ${i}! Returning button.`);
                return btn;
            }
        }

        // Strategy 3: Try finding by class or other attributes if text fails (backup)
        // Adjust this selector if you know a specific class for the approve button
        // const specificBtn = await resolvedRow.$('.approve-btn-class'); 
        
        throw new Error(`Approve button not found in row. Found ${buttons.length} buttons, none matched "Approve".`);
    }

    public getManagerTableRowByText(text: string) {
        // Try searching within the specific table first, then global as fallback
        return this.managerApprovalTable.$(`.//tr[contains(., '${text}')]`);
    }

    public getUserTableRowByText(text: string) {
        // Try searching within the specific table first, then global as fallback
        return this.userApprovalTable.$(`.//tr[contains(., '${text}')]`);
    }

    public getUserTableRowAsManagerByText(text: string) {
        return this.UserApprovaltable_AsManager.$(`.//tr[contains(., '${text}')]`);
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
    public get ManageOrganizationtable(){
        return $(`//div[@class='space-y-4']`);
    }
    public get manageOrganizationDeleteButton(){
        return $(`(//button[normalize-space()='Delete'])[1]`);
    }
    public get ManageOrganizationPageTextNIA(){
        return $(`//div[normalize-space()='Noida International Airport']`);
    }

    public get OrganizationCardApproveUSer_list() {
        return $(`//div[contains(@class,'rounded-md')][.//div[starts-with(normalize-space(),'Test User')]]`);
    }
    public get Manager_ApproveButton(){
        return $(`//button[normalize-space()='Approve']`);
    }
    // Manager Deletion Locators (Originally named "User" but pointing to "Manager")
    public get DeleteUserConfirmationpop_up(){
        return $("//h2[normalize-space()='Delete Manager']")
    }
    public get deleteuserInputBox(){
        return $("//input[@placeholder='Delete Manager']")
    }
    public get deleteuserConfirmButton(){
        return $("//button[normalize-space()='Confirm Delete']")
    }

    // User Specific Deletion Locators (Truly for Users)
    public get UserDeletionPopUp(){
        return $("//h2[normalize-space()='Delete User']")
    }
    public get UserDeletionInputBox(){
        return $("//input[@placeholder='Delete User']")
    }
    public get UserDeletionConfirmButton(){
        return $("//button[normalize-space()='Confirm Delete']")
    }

    public get DeleteManagerConfirmationpop_up(){
        return $("//h2[normalize-space()='Delete Manager']")
    }
    public get deleteManagerInputBox(){
        return $("//input[@placeholder='Delete Manager']")
    }
    public get deleteManagerConfirmButton(){
        return $("//button[normalize-space()='Confirm Delete']")
    }
    public get Myteamsheader_AsManager(){
        return $("//*[normalize-space()='My Team'] | //*[normalize-space()='My Teams']")
    }

    public get UserApprovaltable_AsManager(){
        return $("(//table[@class='w-full caption-bottom text-sm'])[1]")
    }

    public get usertableRows_AsManager() {
        return this.UserApprovaltable_AsManager.$$(`tbody tr`);
    }

    public getOrganizationCard(name: string) {
        return $(`//div[contains(@class,'rounded-md')][.//div[contains(normalize-space(),'${name}')]]`);
    }

    /**
     * navigation and interaction methods
     */
    public async clickManageApprovals() {
        await this.ManageButton.waitForClickable();
        await this.ManageButton.click();
        await this.ManageOrganization.waitForDisplayed();
        await this.ManageApprovals.waitForClickable();    
        await this.ManageApprovals.click();

        // Verify Manager Approval header is displayed
        await this.managerApprovalheader.waitForDisplayed();
        await expect(this.managerApprovalheader).toBeDisplayed();
        
        // Verify manager approval table is displayed
        await this.managerApprovalTable.waitForDisplayed();
        await expect(this.managerApprovalTable).toBeDisplayed();
    }

    public async clickManageApprovalsAsManager() {
        console.log('[DEBUG] Navigating to Manage Approvals as Manager...');
        await this.ManageButton.waitForClickable();
        await this.ManageButton.click();
        
        // Support both "My Team" (Manager) and "Manage Organization" (Admin)
        await this.ManageOrganization.waitForDisplayed();
        
        await this.ManageApprovals.waitForClickable();    
        await this.ManageApprovals.click();

        // Managers only see User Approvals
        await this.UserApproval_header.waitForDisplayed();
        await expect(this.UserApproval_header).toBeDisplayed();
        
        await this.UserApprovaltable_AsManager.waitForDisplayed();
        await expect(this.UserApprovaltable_AsManager).toBeDisplayed();
    }


    public async cleanupTestManagers() {
        console.log('[DEBUG] Cleaning up existing test managers...');
        // Check for manager names starting with "Test" and reject if found (handles multiples and verifies status)
        const rejected = await this.rejectManagersStartingWithPrefix('Test', false);
        if (rejected.length > 0) {
            console.log(`Successfully found and rejected ${rejected.length} manager(s) starting with "Test".`);
        } else {
            console.log('No manager starting with "Test" was found in the approval list.');
        }
    }
    
    // Original rejectManagersStartingWithPrefix function remains here
    public async rejectManagersStartingWithPrefix(prefix: string, shouldVerifyEmpty: boolean = true) {
        let iterations = 0;
        const maxIterations = 50; // Safety break
        const rejectedUsers: string[] = [];

        console.log(`[DEBUG] Starting rejection for managers with prefix: "${prefix}"`);

        // Explicitly scroll to Manager Approval section first
        await this.managerApprovalheader.scrollIntoView({ block: 'center' });


        while (iterations < maxIterations) {
            iterations++;
            let currentMatchIndex = -1;
            
            let rows = await this.managertableRows;
            let rowsCount = await rows.length;
            
            // If No rows found on first try, try a soft refresh by clicking the menu again
            if (iterations === 1 && rowsCount === 0) {
                 console.log(`[DEBUG] No manager rows found on first try. Attempting table refresh...`);
                 await browser.refresh();
                 await this.ManageButton.waitForClickable();
                 await this.ManageButton.click();
                 await this.ManageOrganization.waitForDisplayed();
                 await this.ManageApprovals.waitForClickable();
                 await this.ManageApprovals.click();
                 await this.managerApprovalheader.waitForDisplayed();
                 

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
            await rejectBtn.waitForClickable();
            await rejectBtn.click();
            
            await this.RejectRequest_popup.waitForDisplayed();
            await this.RejectRequest_popup_Reason.setValue('Rejecting for testing purpose');
            await this.RejectRequest_Submit.click();
            
            // Wait for popup to disappear
            await this.RejectRequest_popup.waitForDisplayed({ reverse: true });
            
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


        while (iterations < maxIterations) {
            iterations++;
            let currentMatchIndex = -1;
            
            let rows = await this.usertableRows;
            let rowsCount = await rows.length;
            
            // If No matches on first iteration, try refreshing once
            if (iterations === 1 && rowsCount === 0) {
                 console.log(`[DEBUG] No rows found on first try. Refreshing page...`);
                 await browser.refresh();
                 await this.ManageButton.waitForClickable();
                 await this.ManageButton.click();
                 await this.ManageOrganization.waitForDisplayed();
                 await this.ManageApprovals.waitForClickable();
                 await this.ManageApprovals.click();
                 await this.UserApproval_header.waitForDisplayed();


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
            await rejectBtn.waitForClickable();
            await rejectBtn.click();
            
            await this.RejectRequest_popup.waitForDisplayed();
            await this.RejectRequest_popup_Reason.setValue('Rejecting for testing purpose');
            await this.RejectRequest_Submit.click();
            
            await this.RejectRequest_popup.waitForDisplayed({ reverse: true });
            
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

    public async rejectUsersAsManagerStartingWithPrefix(prefix: string, shouldVerifyEmpty: boolean = true) {
        let iterations = 0;
        const maxIterations = 50;
        const rejectedUsers: string[] = [];

        console.log(`[DEBUG] [Manager View] Starting rejection for users with prefix: "${prefix}"`);

        await this.UserApproval_header.scrollIntoView({ block: 'center' });


        while (iterations < maxIterations) {
            iterations++;
            let currentMatchIndex = -1;
            
            let rows = await this.usertableRows_AsManager;
            let rowsCount = await rows.length;
            
            if (iterations === 1 && rowsCount === 0) {
                 console.log(`[DEBUG] [Manager View] No rows found. Refreshing...`);
                 await browser.refresh();
                 await this.clickManageApprovalsAsManager();
                 rows = await this.usertableRows_AsManager;
                 rowsCount = await rows.length;
            }

            for (let i = 0; i < rowsCount; i++) {
                const row = rows[i];
                if (!(await row.isExisting())) continue;
                const columns = await row.$$('td');
                const colCount = await columns.length;
                if (colCount < 2) continue;
                const nameText = (await columns[0].getText()).trim();
                const status = (await columns[colCount - 2].getText()).toLowerCase().trim();
                if (nameText.toLowerCase().startsWith(prefix.toLowerCase()) && 
                    (status.includes('pending') || status.includes('renew'))) {
                    currentMatchIndex = i;
                    break;
                }
            }

            if (currentMatchIndex === -1) break;

            const matchingRow = rows[currentMatchIndex];
            const matchingNameText = (await (await matchingRow.$$('td'))[0].getText()).trim();
            
            const rejectBtn = await this.getRejectButtonInRow(matchingRow);
            await rejectBtn.scrollIntoView({ block: 'center' });
            await rejectBtn.waitForClickable();
            await rejectBtn.click();
            
            await this.RejectRequest_popup.waitForDisplayed();
            await this.RejectRequest_popup_Reason.setValue('Manager rejection test');
            await this.RejectRequest_Submit.click();
            await this.RejectRequest_popup.waitForDisplayed({ reverse: true });
            
            console.log(`[DEBUG] [Manager View] Waiting for status change for user ${matchingNameText}...`);
            await browser.waitUntil(async () => {
                const refreshedRow = await this.getUserTableRowAsManagerByText(matchingNameText);
                if (!(await refreshedRow.isExisting())) return true;
                const columns = await refreshedRow.$$('td');
                const colCount = await columns.length;
                if (colCount < 2) return false;
                const currentStatus = (await columns[colCount - 2].getText()).toLowerCase();
                return currentStatus.includes('reject');
            }, {
                timeout: 10000,
                timeoutMsg: `Status for user ${matchingNameText} did not change to Rejected in Manager view.`
            });

            console.log(`SUCCESS: Rejected user ${matchingNameText} as Manager`);
            rejectedUsers.push(matchingNameText);
        }

        if (shouldVerifyEmpty) {
            console.log(`[DEBUG] [Manager View] Verifying table status for prefix "${prefix}"...`);
            const rows = await this.usertableRows_AsManager;
            for (const row of rows) {
                const cols = await row.$$('td');
                const colCount = await cols.length;
                if (colCount >= 2) {
                    const name = (await cols[0].getText()).trim();
                    if (name.toLowerCase().startsWith(prefix.toLowerCase())) {
                        const status = (await cols[colCount - 2].getText()).toLowerCase();
                        if (status.includes('pending')) {
                            throw new Error(`Verification Failed: Found pending user ${name} in Manager view after rejection.`);
                        }
                    }
                }
            }
        }
        return rejectedUsers;
    }

    public async ApproveUsersAsManagerStartingWithPrefix(prefix: string, shouldVerifyEmpty: boolean = true) {
        let iterations = 0;
        const maxIterations = 50;
        const approvedUsers: string[] = [];

        console.log(`[DEBUG] [Manager View] Starting approval for users with prefix: "${prefix}"`);

        await this.UserApproval_header.scrollIntoView({ block: 'center' });


        while (iterations < maxIterations) {
            iterations++;
            let currentMatchIndex = -1;
            
            let rows = await this.usertableRows_AsManager;
            let rowsCount = await rows.length;
            
            if (iterations === 1 && rowsCount === 0) {
                 console.log(`[DEBUG] [Manager View] No rows found. Refreshing...`);
                 await browser.refresh();
                 await this.clickManageApprovalsAsManager();
                 rows = await this.usertableRows_AsManager;
                 rowsCount = await rows.length;
            }

            for (let i = 0; i < rowsCount; i++) {
                const row = rows[i];
                if (!(await row.isExisting())) continue;
                const columns = await row.$$('td');
                const colCount = await columns.length;
                if (colCount < 2) continue;
                const nameText = (await columns[0].getText()).trim();
                const status = (await columns[colCount - 2].getText()).toLowerCase().trim();
                if (nameText.toLowerCase().startsWith(prefix.toLowerCase()) && 
                    (status.includes('pending') || status.includes('renew'))) {
                    currentMatchIndex = i;
                    break;
                }
            }

            if (currentMatchIndex === -1) break;

            const matchingRow = rows[currentMatchIndex];
            const matchingColumns = await matchingRow.$$('td');
            const matchingNameText = (await matchingColumns[0].getText()).trim();
            const colCount = await matchingColumns.length;
            
            const approveBtn = await this.getApproveButtonInRow(matchingRow);
            await approveBtn.scrollIntoView({ block: 'center' });
            await approveBtn.waitForClickable();
            await approveBtn.click();
            
            console.log(`[DEBUG] [Manager View] Waiting for status change for user ${matchingNameText}...`);
            await browser.waitUntil(async () => {
                const refreshedRow = await this.getUserTableRowAsManagerByText(matchingNameText);
                if (!(await refreshedRow.isExisting())) return true;
                const updatedCols = await refreshedRow.$$('td');
                const updatedStatus = (await updatedCols[colCount - 2].getText()).toLowerCase();
                return updatedStatus.includes('approve');
            }, {
                timeout: 10000,
                timeoutMsg: `Status for user ${matchingNameText} did not change to Approved in Manager view.`
            });
            

            console.log(`SUCCESS: Approved user ${matchingNameText} as Manager`);
            approvedUsers.push(matchingNameText);
        }

        if (shouldVerifyEmpty) {
            console.log(`[DEBUG] [Manager View] Verifying table status for prefix "${prefix}"...`);
            const rows = await this.usertableRows_AsManager;
            for (const row of rows) {
                const cols = await row.$$('td');
                const colCount = await cols.length;
                if (colCount >= 2) {
                    const name = (await cols[0].getText()).trim();
                    if (name.toLowerCase().startsWith(prefix.toLowerCase())) {
                        const status = (await cols[colCount - 2].getText()).toLowerCase();
                        if (status.includes('pending')) {
                            throw new Error(`Verification Failed: Found pending user ${name} in Manager view after approval.`);
                        }
                    }
                }
            }
        }
        return approvedUsers;
    }

    public async approveManager(nameOrEmail: string) {
        console.log(`[DEBUG] Starting approval for manager: "${nameOrEmail}"`);

        // Explicitly scroll to Manager Approval section first
        await this.managerApprovalheader.scrollIntoView({ block: 'center' });


        let row = await this.getManagerTableRowByText(nameOrEmail);
        
        // If row not found initially, try a refresh
        if (!(await row.isExisting())) {
             console.log(`[DEBUG] Manager row not found on first try. Attempting table refresh...`);
             await browser.refresh();
             await this.ManageButton.waitForClickable();
             await this.ManageButton.click();
             await this.ManageOrganization.waitForDisplayed();
             await this.ManageApprovals.waitForClickable();
             await this.ManageApprovals.click();
             await this.managerApprovalheader.waitForDisplayed();


             row = await this.getManagerTableRowByText(nameOrEmail);
        }

        if (!(await row.isExisting())) {
            throw new Error(`Manager with name or email "${nameOrEmail}" not found in the approval list.`);
        }

        const columns = await row.$$('td');
        const colCount = await columns.length;
        
        if (colCount < 2) {
             throw new Error(`Row for "${nameOrEmail}" does not have enough columns.`);
        }

        const statusCell = columns[colCount - 2]; 
        const status = (await statusCell.getText()).toLowerCase().trim();

        if (status.includes('approve')) {
             console.log(`[DEBUG] Manager "${nameOrEmail}" is already approved.`);
             return;
        }

        console.log(`[DEBUG] Action: Approving manager "${nameOrEmail}"...`);
        const approveBtn = await this.getApproveButtonInRow(row);
        
        // Explicitly verify this is NOT a reject button before clicking
        const btnText = await approveBtn.getText();
        if (btnText.includes('Reject')) {
            throw new Error(`[CRITICAL ERROR] The button identified as 'Approve' has text '${btnText}'. Aborting heavily to prevent rejection.`);
        }
        
        await approveBtn.scrollIntoView({ block: 'center' });

        await approveBtn.waitForClickable();
        await approveBtn.click();
        console.log(`[DEBUG] Clicked approve button for manager "${nameOrEmail}" (Text: ${btnText})`);
        
        await browser.waitUntil(async () => {
            const updatedRow = await this.getManagerTableRowByText(nameOrEmail);
            // If row is gone, it's likely moved to Approved/Organization section
            if (!(await updatedRow.isExisting())) {
                console.log(`[DEBUG] Row for ${nameOrEmail} is no longer in approval list (likely successful).`);
                return true;
            }

            const updatedCols = await updatedRow.$$('td');
            const updatedStatus = (await updatedCols[colCount - 2].getText()).toLowerCase();
            console.log(`[DEBUG] Current status for ${nameOrEmail}: ${updatedStatus}`);
            return updatedStatus.includes('approve');
        }, {
            timeout: 20000,
            timeoutMsg: `Status for ${nameOrEmail} did not change to Approved after 20s.`
        });
        
        console.log(`SUCCESS: Approved manager ${nameOrEmail}`);
    }

    public async approveUsersStartingWithPrefix(prefix: string, shouldVerifyEmpty: boolean = true) {
        let iterations = 0;
        const maxIterations = 50;
        const approvedUsers: string[] = [];

        console.log(`[DEBUG] Starting approval for users with prefix: "${prefix}"`);

        await this.UserApproval_header.scrollIntoView({ block: 'center' });
        await browser.pause(1000);

        while (iterations < maxIterations) {
            iterations++;
            let currentMatchIndex = -1;
            
            let rows = await this.usertableRows;
            let rowsCount = await rows.length;
            
            if (iterations === 1 && rowsCount === 0) {
                 console.log(`[DEBUG] No rows found on first try. Refreshing page...`);
                 await browser.refresh();
                 await this.ManageButton.waitForClickable();
                 await this.ManageButton.click();
                 await this.ManageOrganization.waitForDisplayed();
                 await this.ManageApprovals.waitForClickable();
                 await this.ManageApprovals.click();
                 await this.UserApproval_header.waitForDisplayed();


                 rows = await this.usertableRows;
                 rowsCount = await rows.length;
            }

            for (let i = 0; i < rowsCount; i++) {
                const row = rows[i];
                if (!(await row.isExisting())) continue;

                const columns = await row.$$('td');
                const colCount = await columns.length;
                if (colCount < 2) continue;

                const nameText = (await columns[0].getText()).trim();
                const statusCell = columns[colCount - 2]; 
                const status = (await statusCell.getText()).toLowerCase().trim();

                if (nameText.toLowerCase().startsWith(prefix.toLowerCase()) && 
                    (status.includes('pending') || status.includes('renew'))) {
                    currentMatchIndex = i;
                    break;
                }
            }

            if (currentMatchIndex === -1) break;

            const matchingRow = rows[currentMatchIndex];
            const matchingColumns = await matchingRow.$$('td');
            const matchingNameText = (await matchingColumns[0].getText()).trim();
            
            console.log(`[DEBUG] Action: Approving user "${matchingNameText}"...`);
            const approveBtn = await this.getApproveButtonInRow(matchingRow);
            await approveBtn.scrollIntoView({ block: 'center' });

            await approveBtn.waitForClickable();
            await approveBtn.click();
            console.log(`[DEBUG] Clicked Approve button for user ${matchingNameText}`);
            
            await browser.waitUntil(async () => {
                const updatedRow = await this.getUserTableRowByText(matchingNameText);
                if (!(await updatedRow.isExisting())) {
                    console.log(`[DEBUG] Row for user ${matchingNameText} is no longer in approval list.`);
                    return true;
                }

                const columns = await updatedRow.$$('td');
                const colCount = await columns.length;
                if (colCount < 2) return false;
                
                const currentStatus = (await columns[colCount - 2].getText()).toLowerCase();
                console.log(`[DEBUG] Current status for user ${matchingNameText}: ${currentStatus}`);
                return currentStatus.includes('approve');
            }, {
                timeout: 20000,
                timeoutMsg: `Status for user ${matchingNameText} did not change to Approved after 20000ms.`
            });
            
            console.log(`SUCCESS: Approved user ${matchingNameText}`);
            approvedUsers.push(matchingNameText);

        }

        if (shouldVerifyEmpty) {
            const rows = await this.usertableRows;
            for (const row of rows) {
                const columns = await row.$$('td');
                const colCount = await columns.length;
                if (colCount >= 2) {
                    const nameText = (await columns[0].getText()).trim();
                    if (nameText.startsWith(prefix)) {
                        const status = (await columns[colCount - 2].getText()).toLowerCase();
                        if (status.includes('pending')) {
                            throw new Error(`Verification Failed: Found pending user ${nameText} after approval process.`);
                        }
                    }
                }
            }
        }
        return approvedUsers;
    }

    public async ManageApproval_Approve(prefix: string) {
        return this.approveManager(prefix);
    }

    public async DeleteManagerFromManageOrganization(managerName: string) {
        await this.ManageButton.waitForClickable();
        await this.ManageButton.click();
        
        await this.ManageOrganization.waitForDisplayed();
        await expect(this.ManageOrganization).toBeDisplayed();
        
        console.log(`[DEBUG] Searching for: "${managerName}" in Manage Organization...`);

        // Try to find the card, refresh if not found immediately
        let card = this.getOrganizationCard(managerName);
        
        if (!(await card.isDisplayed())) {
            console.log(`[DEBUG] Card for "${managerName}" not found. Refreshing...`);
            await browser.refresh();
            await this.ManageOrganization.waitForDisplayed();
            card = this.getOrganizationCard(managerName);
        }

        // Final wait and assertion
        try {
            await card.waitForDisplayed();
            await expect(card).toBeDisplayed();
        } catch (error) {
            console.error(`[DEBUG] FAILED to find card for "${managerName}".`);
            // Log some text from the page to help find what's there
            const allText = await this.ManageOrganizationtable.getText();
            console.log(`[DEBUG] Page Table Text: ${allText.substring(0, 1000)}`);
            throw error;
        }
        
        console.log(`[DEBUG] Found card for "${managerName}". Clicking Delete...`);
        const deleteBtn = await card.$(`.//button[normalize-space()='Delete']`);
        await deleteBtn.waitForClickable();
        await deleteBtn.click();

        // Handle deletion popup
        console.log(`[DEBUG] Waiting for Manager deletion popup...`);
        // Using the original locator names for Manager flow
        await this.DeleteUserConfirmationpop_up.waitForDisplayed();
        await expect(this.DeleteUserConfirmationpop_up).toBeDisplayed();

        await this.deleteuserInputBox.waitForDisplayed();
        await this.deleteuserInputBox.setValue("Delete Manager");
        
        await this.deleteuserConfirmButton.waitForClickable();
        await this.deleteuserConfirmButton.click();

        // Verify card disappearance
        await card.waitForDisplayed({ reverse: true });
        await expect(card).not.toBeDisplayed();
        
        console.log(`[DEBUG] Successfully deleted manager: "${managerName}"`);
    }

    public async DeleteUserFromManageOrganization(userName: string) {
        await this.ManageButton.waitForClickable();
        await this.ManageButton.click();
        
        await this.ManageOrganization.waitForDisplayed();
        await expect(this.ManageOrganization).toBeDisplayed();
        
        console.log(`[DEBUG] Searching for User: "${userName}" in Manage Organization...`);

        // Try to find the user card, refresh if not found immediately
        let card = this.getOrganizationCard(userName);
        
        if (!(await card.isDisplayed())) {
            console.log(`[DEBUG] Card for User "${userName}" not found. Refreshing...`);
            await browser.refresh();
            await this.ManageOrganization.waitForDisplayed();
            card = this.getOrganizationCard(userName);
        }

        // Final wait and assertion to verify user is displayed
        await card.waitForDisplayed();
        await expect(card).toBeDisplayed();
        console.log(`[DEBUG] VERIFIED: User "${userName}" is displaying in Manage Organization.`);
        
        console.log(`[DEBUG] Found card for User "${userName}". Clicking Delete...`);
        const deleteBtn = await card.$(`.//button[normalize-space()='Delete']`);
        await deleteBtn.waitForClickable();
        await deleteBtn.click();

        // Handle deletion popup
        console.log(`[DEBUG] Waiting for User deletion popup...`);
        await this.UserDeletionPopUp.waitForDisplayed();
        await expect(this.UserDeletionPopUp).toBeDisplayed();

        await this.UserDeletionInputBox.waitForDisplayed();
        await this.UserDeletionInputBox.setValue("Delete User");
        
        await this.UserDeletionConfirmButton.waitForClickable();
        await this.UserDeletionConfirmButton.click();

        // Verify card disappearance
        await card.waitForDisplayed({ reverse: true });
        await expect(card).not.toBeDisplayed();
        
        console.log(`[DEBUG] Successfully deleted User: "${userName}"`);
    }



}

export default new ManagePage();
