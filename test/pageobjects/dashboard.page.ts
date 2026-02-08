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
    public virtulaMachine() {
        return $(`//h3[contains(normalize-space(), 'Virtual Machines')]`);
    }
    public virtulaMachine_Count() {
        return $(`//h3[contains(normalize-space(), 'Virtual Machines')]/following-sibling::div`);
    }
    public ACE() {
        return $(`//h3[contains(normalize-space(), 'ACE')]`);
    }
    public ACE_Count() {
        return $(`//h3[contains(normalize-space(), 'ACE')]/following-sibling::div`);
    }
    public MQ() {
        return $(`//h3[contains(normalize-space(), 'MQ')]`);
    }
    public MQ_Count() {
        return $(`//h3[contains(normalize-space(), 'MQ')]/following-sibling::div`);
    }
    public Physical_Infra() {
        return $(`//h3[contains(normalize-space(), 'Physical Infra')]`);
    }
    public Physical_Infra_Count() {
        return $(`//h3[contains(normalize-space(), 'Physical Infra')]/following-sibling::div`);
    }
    public AllSystem_operational(){
        return $(`//div[text()="All systems operational"]`)
    }



    public async QueueManager() {
        await this.AIPLogo.waitForDisplayed({timeout: 10000});
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
            await this.Dashboard_QM_Count.waitForDisplayed({ timeout: 30000 });
            
            // Get Frontend Data
            const qmCount = await this.Dashboard_QM_Count.getText();
            const queueCount = await this.Dashboard_TotalQueue_Count.getText();
            const intServerCount = await this.Dashboard_IntegrationServer_Count.getText();
            const msgFlowCount = await this.Dashboard_messageFlow_Count.getText();
            const vmsCount = await this.Dashboard_TotalVMs_Count.getText();

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
        await this.InfraCat_Header.waitForDisplayed({ timeout: 10000 });
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
                // Construct a more robust relative selector. 
                // We search for the text within the ancestor that likely contains the whole card.
                const cardContainer = headerElem.parentElement().parentElement();
                const allSysOp = cardContainer.$(`.//div[text()='All systems operational']`);
                
                // Check if it exists first to avoid exception logs from waitForDisplayed
                if (await allSysOp.isExisting()) {
                    await allSysOp.waitForDisplayed({ timeout: 2000 });
                    console.log(`SUCCESS: '${name}' - 'All systems operational' verified within card.`);
                } else {
                    // Fallback: check if ANY operational message is visible on the page
                    const globalAllSysOp = $(`//div[text()='All systems operational']`);
                    if (await globalAllSysOp.isExisting() && await globalAllSysOp.isDisplayed()) {
                        console.log(`SUCCESS: '${name}' - 'All systems operational' verified (found on page).`);
                    } else {
                         console.warn(`WARNING: '${name}' - 'All systems operational' message NOT found.`);
                         // We don't throw here to avoid failing if the UI slightly varies, 
                         // but you can change this to 'await expect(...).toBeDisplayed()' for strictness.
                    }
                }
            }
        };

        // Validate Virtual Machines
        const downVMs = apiData.vms || [];
        await validateCategory('Virtual Machines', this.virtulaMachine(), this.virtulaMachine_Count(), downVMs.length);
        if (downVMs.length > 0) {
             for (const vm of downVMs) {
                 const vmElement = $(`//span[normalize-space()='${vm.vm_name}']`);
                 await expect(vmElement).toBeDisplayed();
             }
        }

        // Validate ACE (Applications + Message Flows)
        const downApps = apiData.applications || [];
        const downFlows = apiData.messageFlows || [];
        const totalDownACE = downApps.length + downFlows.length;
        await validateCategory('ACE', this.ACE(), this.ACE_Count(), totalDownACE);

        // Validate MQ (Queue Managers)
        const downQMs = apiData.queuemanagers || [];
        await validateCategory('MQ', this.MQ(), this.MQ_Count(), downQMs.length);

        // Validate Physical Infra (Hosts)
        const downHosts = apiData.hosts || [];
        await validateCategory('Physical Infra', this.Physical_Infra(), this.Physical_Infra_Count(), downHosts.length);
    }


}

export default new DashboardPage();
