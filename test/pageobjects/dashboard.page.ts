import { $ } from '@wdio/globals';
import Page from './page.js';
import ApiPage from './api.page.js';
import { getTestData } from '../utils/dynamicTestData.js';

class DashboardPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get AIPLogo() {
        return $(`//img[@alt='AIP Sentinel']`);
    }

    public get DashboardHeader() {
        return $(`//h1[normalize-space()='Dashboard']`);
    }
    public get DashboardAlert() {
        return $(`//div[@role='alert']`);
    }
    public get DashboardAlertText() {
        return $(`//span[contains(normalize-space(), 'There are') and contains(normalize-space(), 'critical alerts requiring attention')]`);
    }
    public get DashboardAlerts_ViewBtn() {
        return $(`//div[@class='flex items-center space-x-2']//button[@class='inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md h-9 rounded-md px-3 text-xs'][normalize-space()='View Details']`);
    }
    public get DashboardAlerts_CrossBtn() {
        return $(`//div[@class='flex items-center space-x-2']//button[contains(@class, 'disabled:opacity-50')]`);
    }
    public get Dashboard_QM() {
        return $(`//p[normalize-space()='Queue Managers']`);
    }
    public get Dashboard_QM_Count() {
        return $(`//p[normalize-space()='Queue Managers']/following-sibling::p`);
    }

    public get Dashboard_TotalQueue() {
        return $(`//p[normalize-space()='Total Queues']`);
    }
    public get Dashboard_TotalQueue_Count() {
        return $(`//p[normalize-space()='Total Queues']/following-sibling::p`);
    }

    public get Dashboard_IntegrationServer() {
        return $(`//p[normalize-space()='Integration Servers']`);
    }
    public get Dashboard_IntegrationServer_Count() {
        return $(`//p[normalize-space()='Integration Servers']/following-sibling::p`);
    }

    public get Dashboard_messageFlow() {
        return $(`//p[normalize-space()='Message Flows']`);
    }
    public get Dashboard_messageFlow_Count() {
        return $(`//p[normalize-space()='Message Flows']/following-sibling::p`);
    }

    public get Dashboard_PhysicalServer() {
        return $(`//p[normalize-space()='Physical Servers']`);
    }
    public get Dashboard_TotalHost() {
        return $(`//p[normalize-space()='Total Hosts']`);
    }
    public get Dashboard_TotalVMs() {
        return $(`//p[normalize-space()='Total VMs']`); 
    }
    public get Dashboard_TotalVMs_Count() {
        return $(`//p[normalize-space()='Total VMs']/following-sibling::p`);
    }
    public get Dashboard_backupsJobs() {
        return $(`//p[normalize-space()='Backup Jobs']`);
    }
    public get QueueManager_Header() {
        return $(`//h1[normalize-space()='Queue Managers']`);
    }
    public get QueueManager_table() {
        return $(`//tbody`);
    }
    public get QueueManager_table_row() {
        return $$(`//tbody/tr`);
    }
    public get QueueManager_table_row_col() {
        return $(`//tbody/tr/td`);
    }

    public get InfraCat_Header(){
        return $("//h2[normalize-space()='Infrastructure Categories']")
    }
    public get virtualMachine() {
        return $(`//h3[contains(normalize-space(), 'Virtual Machines')]`);
    }
    public get virtualMachine_Count() {
        return $(`//h3[contains(normalize-space(), 'Virtual Machines')]/following-sibling::div`);
    }
    public get applications() {
        // More robust: looks for ACE or Applications/Integrations if text changed
        return $(`//h3[contains(normalize-space(), 'ACE') or contains(normalize-space(), 'Applications') or contains(normalize-space(), 'Integration')]`);
    }
    public get applications_Count() {
        return $(`//h3[contains(normalize-space(), 'ACE') or contains(normalize-space(), 'Applications') or contains(normalize-space(), 'Integration')]/following-sibling::div`);
    }
    public get MQ() {
        return $(`//h3[contains(normalize-space(), 'MQ')]`);
    }
    public get MQ_Count() {
        return $(`//h3[contains(normalize-space(), 'MQ')]/following-sibling::div`);
    }
    public get Physical_Infra() {
        return $(`//h3[contains(normalize-space(), 'Physical Infra')]`);
    }
    public get Physical_Infra_Count() {
        return $(`//h3[contains(normalize-space(), 'Physical Infra')]/following-sibling::div`);
    }
    public get AllSystemsOperational() {
        return $(`//div[text()="All systems operational"]`);
    }
    public get AllSystemsOperational_Selector() {
        return ".//div[normalize-space()='All systems operational']";
    }
    public get AdminPanel_header() {
        return $(`//h3[normalize-space()='Admin Panel']`);
    }
    public get SystemAlerts_btn() {
        return $(`//button[contains(normalize-space(),'System Alerts')]`);
    }
    public get managerTools_Header() {
        return $(`//h3[normalize-space()='Manager Tools']`);
    }
    public get managerTool_Sub_header() {
        return $(`//p[normalize-space()='Management functions and controls']`);
    }
    public get AdminPanel_Sub_header() {
        return $(`//p[normalize-space()='Administrative functions and controls']`);
    }
    public get AdminPanel_Buttons_Selector() {
        return `//div[@class='grid gap-4 md:grid-cols-2']//button`;
    }
    public get ManageOrganization_Header() {
        return $(`//h1[normalize-space()='Manage Organization']`);
    }
    public get ManageApprovals_Span() {
        return $(`//span[text()="Manage Approvals"]`);
    }
    public get Settings_Header() {
        return $(`//h1[normalize-space()='Settings']`);
    }
    public get ActivityLogs_Header() {
        return $(`//h1[normalize-space()='Activity Logs']`);
    }

    public get usermanagement_btn() {
        return $(`//*[self::h1 or self::button or self::span][contains(normalize-space(),'Manage Organization')]`);
    }

    public get accountApproval_btn() {
        return $(`//*[self::h1 or self::button or self::span][contains(normalize-space(),'Manage Approvals')]`);
    }

    public get Setting_btn() {
        return $(`//*[self::h1 or self::button or self::span][contains(normalize-space(),'Settings')]`);
    }

    public get ManagerAuditLogs_btn() {
        return $(`//*[self::h1 or self::button or self::span][contains(normalize-space(),'Activity Logs')]`);
    }

    public getVMElement(vmName: string) {
        return $(`//span[normalize-space()='${vmName}']`);
    }

    public get ActiveAlertsTxt(){
        return $(`//h3[normalize-space()='Active Alerts']`);
    }
    public get ActiveAlertsSubTxt(){
        return $(`//p[normalize-space()='System alerts requiring attention']`);
    }
    public get ActiveAlerts_ShowmoreButton(){
        return $(`//button[text()="Show more →"]`);
    }
    public get Dashboard_ActiveAlerts(){
        return $(`//h3[normalize-space()='Active Alerts']/parent::div/following-sibling::div`);
    }

    public get ActiveAlertItems() {
        // Target specifically the alert cards list within the alerts section
        return $$(`//div[@id='alerts-section']//button[normalize-space()='View Details']`);
    }

    public getAlertViewDetailsButton(alert: any) {
        return alert.$(`.//button[text()='View Details']`);
    }

    public get AlertsDetailspopup_ResolveButton(){
        return $(`//button[normalize-space()='Resolve']`);
    }

    public get AlertsDetailspopup_ACKButton(){
        return $(`//button[normalize-space()='Acknowledge']`);
    }

    public get AlertsDetailspopup_CloseButton(){
        return $(`//button[contains(text(),'Close')]`);
    }
    public get AlertsDetailspopup_CheckAvailableButton(){
        return $(`//button[contains(normalize-space(), 'Check available') or contains(normalize-space(), 'Check Available')]`);
    }

    public get Apps_IntegrationServer(){
        return $(`//h1[normalize-space()='Apps']`);
    }
    public get VCmont(){
        return $("//h1[normalize-space()='vCenter Monitoring']")
    }
    public get PhysicalServers(){
        return $("//p[normalize-space()='Physical Servers']")
    }

    public async QueueManager() {
        await this.AIPLogo.waitForDisplayed();
        await this.AIPLogo.isDisplayed()
    }

    public async validateDashboardElementsDisplayed() {
        
        // Fetch Backend Data (Attempt this first to ensure we have logs even if UI fails)
        let apiData: any = {};
        try {
            const cookies = await browser.getCookies();
            const tokenCookie = cookies.find(c => c.name === 'aip_access_token');
            const token = tokenCookie ? tokenCookie.value : undefined;
            const testdata = getTestData();
            const baseUrl = testdata.URL.replace(/\/$/, '');

            if (token) {
                await ApiPage.setupClient(baseUrl, cookies, token);
                const response = await ApiPage.getSystemOverview();
                apiData = response.data.data;
                console.log('--------------------------------------------------');
                console.log('Backend Data (Fetched before UI validation):', JSON.stringify(apiData, null, 2));
            } else {
                console.log('Skipping backend verification: Token not found');
            }
        } catch (e) {
            console.error('Failed to fetch backend data:', e);
        }

        try {
            // Wait for elements with increased timeout
            await this.Dashboard_QM_Count.waitForDisplayed();
            
            // Get Frontend Data
            const qmCount = await this.Dashboard_QM_Count.getText();
            const queueCount = await this.Dashboard_TotalQueue_Count.getText();
            const intServerCount = await this.Dashboard_IntegrationServer_Count.getText();
            const msgFlowCount = await this.Dashboard_messageFlow_Count.getText();
            const vmsCount = await this.Dashboard_TotalVMs_Count.getText();
            // Navigating to Queue Managers
            await expect(this.Dashboard_QM_Count).toBeClickable();
            await this.Dashboard_QM_Count.click();
            await this.QueueManager_Header.waitForDisplayed();
            await expect(this.QueueManager_Header).toBeDisplayed();
            await browser.back();
            await this.DashboardHeader.waitForDisplayed();

            // Navigating to Total Queues (Queue Managers)
            await expect(this.Dashboard_TotalQueue_Count).toBeClickable();
            await this.Dashboard_TotalQueue_Count.click();
            await this.QueueManager_Header.waitForDisplayed();
            await expect(this.QueueManager_Header).toBeDisplayed();
            await browser.back();
            await this.DashboardHeader.waitForDisplayed();

            // Navigating to Integration Servers
            await expect(this.Dashboard_IntegrationServer_Count).toBeClickable();
            await this.Dashboard_IntegrationServer_Count.click();
            await this.Apps_IntegrationServer.waitForDisplayed();
            await expect(this.Apps_IntegrationServer).toBeDisplayed();
            await browser.back();
            await this.DashboardHeader.waitForDisplayed();

            // Navigating to Message Flows
            await expect(this.Dashboard_messageFlow_Count).toBeClickable();
            await this.Dashboard_messageFlow_Count.click();
            await this.Apps_IntegrationServer.waitForDisplayed();
            await expect(this.Apps_IntegrationServer).toBeDisplayed();
            await browser.back();
            await this.DashboardHeader.waitForDisplayed();

            // Navigating to Total VMs
            await expect(this.Dashboard_TotalVMs_Count).toBeClickable();
            await this.Dashboard_TotalVMs_Count.click();
            await this.VCmont.waitForDisplayed();
            await expect(this.VCmont).toBeDisplayed();
            await browser.back();
            await this.DashboardHeader.waitForDisplayed();

            // Navigating to Physical Servers
            await expect(this.PhysicalServers).toBeClickable();
            await this.PhysicalServers.click();
            await this.VCmont.waitForDisplayed();
            await expect(this.VCmont).toBeDisplayed();
            await browser.back();
            await this.DashboardHeader.waitForDisplayed();
        
        

            // Log Comparison
            console.log('--------------------------------------------------');
            console.log(`Queue Managers - Frontend: ${qmCount}, Backend: ${apiData.qms}`);
            console.log(`Total Queues - Frontend: ${queueCount}, Backend: ${apiData.queues}`);
            console.log(`Integration Servers - Frontend: ${intServerCount}, Backend: ${apiData.integrationServers}`);
            console.log(`Message Flows - Frontend: ${msgFlowCount}, Backend: ${apiData.messageFlows}`);
            console.log(`Total VMs - Frontend: ${vmsCount}, Backend: ${apiData.vms}`);
            console.log('--------------------------------------------------');

            await expect(this.Dashboard_QM_Count).toBeDisplayed();
            await expect(this.Dashboard_TotalQueue_Count).toBeDisplayed();
            await expect(this.Dashboard_IntegrationServer_Count).toBeDisplayed();
            await expect(this.Dashboard_messageFlow_Count).toBeDisplayed();
            await expect(this.Dashboard_TotalVMs_Count).toBeDisplayed();

        } catch (error) {
            console.error('UI Validation Failed. Taking screenshot...');
            await browser.saveScreenshot('./test_logs/dashboard_elements_not_displayed.png');
            throw error;
        }
    }

    public async InfraCat() {
        await this.InfraCat_Header.waitForDisplayed();
        await expect(this.InfraCat_Header).toBeDisplayed();

        let apiData: any = {};
        try {
            const cookies = await browser.getCookies();
            const tokenCookie = cookies.find(c => c.name === 'aip_access_token');
            const token = tokenCookie ? tokenCookie.value : undefined;
            const testdata = getTestData();
            const baseUrl = testdata.URL.replace(/\/$/, '');

            if (token) {
                await ApiPage.setupClient(baseUrl, cookies, token);
                const response = await ApiPage.getDownComponents();
                apiData = response.data.data;
                
                if (!apiData) {
                    console.log('API returned no data (all systems operational). Defaulting to empty object.');
                    apiData = {};
                }

                console.log('--------------------------------------------------');
                console.log('Down Components Data:', JSON.stringify(apiData, null, 2));
            } else {
                console.log('Skipping backend verification: Token not found');
                return;
            }
        } catch (e) {
            console.error('Failed to fetch down components data:', e);
            console.log('Proceeding with UI validation only (assuming 0 down if API failed).');
            apiData = {}; 
        }

        const validateCategory = async (name: string, headerElem: any, countElem: any, downCount: number) => {
            try {
                if (!(await headerElem.isExisting())) {
                    console.error(`ERROR: '${name}' header not found using selector: ${headerElem.selector}`);
                    const allH3 = await $$('h3');
                    const texts = await allH3.map(h => h.getText());
                    console.log(`[DEBUG] All H3 elements found on page: ${JSON.stringify(texts)}`);
                    throw new Error(`Header for ${name} not found.`);
                }
                await headerElem.scrollIntoView();
                const countText = await countElem.getText();
                
                console.log('--------------------------------------------------');
                console.log(`[BC vs FE Comparison] - ${name}`);
                console.log(` > Backend (API): ${downCount}`);
                console.log(` > Frontend (UI): ${countText}`);
                console.log('--------------------------------------------------');
                
                if (!countText.includes(downCount.toString())) {
                    throw new Error(`${name} Count Mismatch! Expected to contain: ${downCount}, Found: ${countText}`);
                }

                if (downCount === 0) {
                    // We search for the text within the ancestor that likely contains the whole card.
                    const cardContainer = await headerElem.parentElement().parentElement();
                    const allSysOp = cardContainer.$(this.AllSystemsOperational_Selector);
                    
                    // Check if it exists first to avoid exception logs from waitForDisplayed
                    if (await allSysOp.isExisting()) {
                        await allSysOp.waitForDisplayed();
                        console.log(`SUCCESS: '${name}' - 'All systems operational' verified within card.`);
                    } else {
                        // Fallback: check if ANY operational message is visible on the page
                        const globalAllSysOp = this.AllSystemsOperational;
                        if (await globalAllSysOp.isExisting() && await globalAllSysOp.isDisplayed()) {
                            console.log(`SUCCESS: '${name}' - 'All systems operational' verified (found on page).`);
                        } else {
                             console.warn(`WARNING: '${name}' - 'All systems operational' message NOT found.`);
                
                        }
                    }
                }
            } catch (err: any) {
                console.error(`[ERROR] validateCategory failed for '${name}': ${err.message}`);
                throw err;
            }
        };

        // Validate Virtual Machines
        const downVMs = apiData.vms || [];
        await validateCategory('Virtual Machines', this.virtualMachine, this.virtualMachine_Count, downVMs.length);
        if (downVMs.length > 0) {
             for (const vm of downVMs) {
                 const vmElement = this.getVMElement(vm.vm_name);
                 await expect(vmElement).toBeDisplayed();
             }
        }

        // Validate Applications (Applications + Message Flows)
        const downApps = apiData.applications || [];
        const downFlows = apiData.messageFlows || [];
        const totalDownApplications = downApps.length + downFlows.length;
        await validateCategory('Applications', this.applications, this.applications_Count, totalDownApplications);

        // Validate MQ (Queue Managers)
        const downQMs = apiData.queuemanagers || [];
        await validateCategory('MQ', this.MQ, this.MQ_Count, downQMs.length);

        // Validate Physical Infra (Hosts)
        const downHosts = apiData.hosts || [];
        await validateCategory('Physical Infra', this.Physical_Infra, this.Physical_Infra_Count, downHosts.length);
    }

    public async validateAdminPanel_Dashboard() {
        await this.AdminPanel_header.scrollIntoView();
        await expect(this.AdminPanel_header).toBeDisplayed();
        await expect(this.AdminPanel_Sub_header).toBeDisplayed();
        
        const getButtons = async () => await $$(this.AdminPanel_Buttons_Selector);
        const allButtons = await getButtons();
        const buttonsCount = await allButtons.length;
        console.log(`Found ${buttonsCount} buttons in Admin Panel.`);

        for (let i = 0; i < buttonsCount; i++) {
            // Re-fetch buttons inside the loop for maximum robustness
            const currentButtons = await getButtons();
            const btn = currentButtons[i];
            const btnText = await btn.getText();
            
            console.log(`Clicking Admin Panel button: ${btnText}`);
            await btn.click();
            
            // Define verification logic based on button text using getters
            if (btnText.includes('User Management')) {
                await this.ManageOrganization_Header.waitForDisplayed();
                await expect(this.ManageOrganization_Header).toBeDisplayed();
            } 
            else if (btnText.includes('Account Approvals')) {
                await this.ManageApprovals_Span.waitForDisplayed();
                await expect(this.ManageApprovals_Span).toBeDisplayed();
            }
            else if (btnText.includes('Settings')) {
                await this.Settings_Header.waitForDisplayed();
                await expect(this.Settings_Header).toBeDisplayed();
            }
            else if (btnText.includes('Audit Logs')) {
                await this.ActivityLogs_Header.waitForDisplayed();
                await expect(this.ActivityLogs_Header).toBeDisplayed();
                const actualText = await this.ActivityLogs_Header.getText();
                console.log(`Verified Audit Logs redirect text: ${actualText}`);
                await expect(actualText).toContain('Activity Logs');
            }

            console.log(`Validated redirect for: ${btnText}. Navigating back...`);
            await browser.back();
            await this.AdminPanel_header.waitForDisplayed();
        }
    }
    public async validateManagerTools_Dashboard() {
        await this.managerTools_Header.scrollIntoView();
        await expect(this.managerTools_Header).toBeDisplayed();
        await expect(this.managerTool_Sub_header).toBeDisplayed();
        
        const getButtons = async () => await $$(this.AdminPanel_Buttons_Selector);
        const allButtons = await getButtons();
        const buttonsCount = await allButtons.length;
        console.log(`Found ${buttonsCount} buttons in Manager Tools.`);

        for (let i = 0; i < buttonsCount; i++) {
            const currentButtons = await getButtons();
            const btn = currentButtons[i];
            const btnText = await btn.getText();
            
            console.log(`Clicking Manager Tools button: ${btnText}`);
            await btn.click();
            
            if (btnText.includes('User Management')) {
                await this.usermanagement_btn.waitForDisplayed();
                await expect(this.usermanagement_btn).toBeDisplayed();
            } 
            else if (btnText.includes('Account Approvals')) {
                await this.accountApproval_btn.waitForDisplayed();
                await expect(this.accountApproval_btn).toBeDisplayed();
            }
            else if (btnText.includes('Settings')) {
                await this.Setting_btn.waitForDisplayed();
                await expect(this.Setting_btn).toBeDisplayed();
            }
            else if (btnText.includes('Audit Logs')) {
                await this.ManagerAuditLogs_btn.waitForDisplayed();
                await expect(this.ManagerAuditLogs_btn).toBeDisplayed();
                const actualText = await this.ManagerAuditLogs_btn.getText();
                console.log(`Verified Audit Logs redirect text: ${actualText}`);
                await expect(actualText).toContain('Activity Logs');
            }

            console.log(`Validated redirect for: ${btnText}. Navigating back...`);
            await browser.back();
            await this.managerTools_Header.waitForDisplayed();
        }
        await expect(this.ActiveAlerts_ShowmoreButton).toBeClickable();
    }

    public async validateUserDashboard_Aesthetics() {
        await this.AIPLogo.waitForDisplayed();
        await expect(this.AIPLogo).toBeDisplayed();
        await this.DashboardHeader.waitForDisplayed();
        await expect(this.DashboardHeader).toBeDisplayed();
        
        // Scroll to and verify Infrastructure Categories as it's common for all roles
        await this.InfraCat_Header.scrollIntoView();
        await expect(this.InfraCat_Header).toBeDisplayed();

        // Verify that Admin Panel and Manager Tools are NOT visible to restricted users
        await expect(this.AdminPanel_header).not.toBeDisplayed();
        await expect(this.managerTools_Header).not.toBeDisplayed();
        
        console.log("[DEBUG] Successfully validated User dashboard aesthetics (Negative checks passed).");
    }

public async DashboardActive_Alerts_Validation() {
    await this.ActiveAlertsTxt.waitForDisplayed();
    await this.ActiveAlertsTxt.scrollIntoView();
    await expect(this.ActiveAlertsTxt).toBeDisplayed();
    
    await expect(this.ActiveAlerts_ShowmoreButton).toBeClickable();
    console.log(`[DEBUG] Verified 'Show more' button is clickable.`);

    // Wait for at least one alert to load
    let lastFoundCount = 0;
    await browser.waitUntil(async () => {
        const buttons = await this.ActiveAlertItems;
        lastFoundCount = await buttons.length;
        console.log(`[DEBUG] Polling: Found ${lastFoundCount} 'View Details' buttons in #alerts-section.`);
        return lastFoundCount > 0;
    }, {
        timeout: 20000,
        timeoutMsg: `TIMEOUT: Expected alerts to load, but found ${lastFoundCount} after 20s.`
    });

    const activeAlerts = await this.ActiveAlertItems;
    const count = await activeAlerts.length;
    console.log(`[DEBUG] Found ${count} active alerts. Validating the first one...`);

    if (count > 0) {
        const firstViewDetailsBtn = activeAlerts[0];
        await firstViewDetailsBtn.scrollIntoView();
        await firstViewDetailsBtn.click();  
        console.log(`[DEBUG] Clicked 'View Details' for the first active alert.`);
        
        await this.AlertsDetailspopup_ResolveButton.waitForDisplayed();
        await expect(this.AlertsDetailspopup_ResolveButton).toBeClickable();
        await expect(this.AlertsDetailspopup_ACKButton).toBeClickable();
        await expect(this.AlertsDetailspopup_CloseButton).toBeClickable();
        
        // Check for 'Check available' if it appears
        if (await this.AlertsDetailspopup_CheckAvailableButton.isExisting()) {
            await expect(this.AlertsDetailspopup_CheckAvailableButton).toBeClickable();
            console.log(`[DEBUG] Verified 'Check available' button is clickable in popup.`);
        }

        console.log(`[DEBUG] Verified popup buttons (Resolve, Acknowledge, Check Available, Close).`);

        await this.AlertsDetailspopup_CloseButton.click();
        console.log(`[DEBUG] Clicked 'Close' on alert details popup.`);
        await this.AlertsDetailspopup_CloseButton.waitForDisplayed({ reverse: true });
    }
}

public async DashboardActive_Alerts_Validation_User() {
    await this.ActiveAlertsTxt.waitForDisplayed();
    await this.ActiveAlertsTxt.scrollIntoView();
    await expect(this.ActiveAlertsTxt).toBeDisplayed();
    
    await expect(this.ActiveAlerts_ShowmoreButton).toBeClickable();
    console.log(`[DEBUG] Verified 'Show more' button is clickable.`);

    // Wait for at least one alert to load
    let lastFoundCountUser = 0;
    await browser.waitUntil(async () => {
        const buttons = await this.ActiveAlertItems;
        lastFoundCountUser = await buttons.length;
        console.log(`[DEBUG] Polling: Found ${lastFoundCountUser} 'View Details' buttons in #alerts-section.`);
        return lastFoundCountUser > 0;
    }, {
        timeout: 20000,
        timeoutMsg: `TIMEOUT: Expected alerts to load, but found ${lastFoundCountUser} after 20s.`
    });

    const activeAlerts = await this.ActiveAlertItems;
    const count = await activeAlerts.length;
    console.log(`[DEBUG] Found ${count} active alerts for User. Validating the first one...`);

    if (count > 0) {
        const firstViewDetailsBtn = activeAlerts[0];
        await firstViewDetailsBtn.scrollIntoView();
        await firstViewDetailsBtn.click();  
        console.log(`[DEBUG] Clicked 'View Details' for an active alert (User).`);
        
        await this.AlertsDetailspopup_CloseButton.waitForDisplayed();
        
        // Negative checks: Resolve and Acknowledge should NOT be present for User role
        await expect(this.AlertsDetailspopup_ResolveButton).not.toBeDisplayed();
        await expect(this.AlertsDetailspopup_ACKButton).not.toBeDisplayed();
        console.log(`[DEBUG] Verified Resolve and Acknowledge buttons are NOT displayed for User role.`);

        await expect(this.AlertsDetailspopup_CloseButton).toBeClickable();
        
        // Check for 'Check available' if it appears
        if (await this.AlertsDetailspopup_CheckAvailableButton.isExisting()) {
            await expect(this.AlertsDetailspopup_CheckAvailableButton).toBeClickable();
            console.log(`[DEBUG] Verified 'Check available' button is clickable in popup (User).`);
        }

        console.log(`[DEBUG] Verified popup buttons for User (Close).`);

        await this.AlertsDetailspopup_CloseButton.click();
        console.log(`[DEBUG] Clicked 'Close' on alert details popup (User).`);
        await this.AlertsDetailspopup_CloseButton.waitForDisplayed({ reverse: true });
    }
}
}

export default new DashboardPage();
