import Page from "./page.js";
import ApiPage from "./api.page.js";
import { getTestData } from "../utils/dynamicTestData.js";
import { expect, browser } from "@wdio/globals";

class AppsPage extends Page {
  /**
   * define selectors using getter methods
   */
  public get appsHeader() {
    return $("//h1[normalize-space()='Apps']"); // Change header text if different
  }
  public get apps_FromSidebar() {
    return $("(//span[contains(text(),'Apps')])[1]"); // Change sidebar text if different
  }

  public get appsDropdown(){
    return $("//button[@role='combobox']");
  }

  public get appsDropdownOptions(){
    return $$("//ul[@role='listbox']//li");
  }

  public get Apps_Table(){
    return $(`//table[@class='w-full caption-bottom text-sm']`);
  }
  public get TableRows() {
    return $$("//table//tbody/tr");
  }
  public get IntegrationServerButton(){
    return $("(//button[normalize-space()='Integration Servers'])[1]");
  }
  public get CustomApps(){
    return $("(//button[normalize-space()='Custom Apps'])[1]")
  }
  public get nextButton(){
    return $("//button[normalize-space()='Next']")
  }
  public get previousButton(){
    return $("//button[normalize-space()='Previous']")
  }
  public get NoCustAppFound_msg(){
    return $("//span[contains(text(),'No custom applications found for the selected envi')]")
  }

  /**
   * Navigates to Apps page from Dashboard
   */
  public async verifyAppsPage() {
    await this.apps_FromSidebar.click();
    
    // Click Integration Servers to load the correct table
    await this.IntegrationServerButton.waitForDisplayed();
    await this.IntegrationServerButton.click();
    await this.appsHeader.isDisplayed();
    await this.Apps_Table.waitForDisplayed();
    await expect(this.Apps_Table).toBeDisplayed();

    console.log("[DEBUG] ===== Validation for ALL =====");
    // User instruction: NO need to validate with Frontend for 'ALL'
    // Just verify the rows are clickable

    const uiRowsElements = await this.TableRows;
    const uiRows = [...uiRowsElements];
    console.log(`[DEBUG] [FE] Total rows visible on page: ${uiRows.length}`);
    
    if (uiRows.length > 0) {
      console.log(`[DEBUG] [FE] Verifying each row is clickable...`);
      for (const row of uiRows) {
        await expect(row).toBeClickable();
      }
      console.log(`[DEBUG] [FE] Validated all ${uiRows.length} rows are clickable.`);
    }
  }

  public async verifyAppsPage_ByEnvironment() {
    await this.apps_FromSidebar.click();

    await this.IntegrationServerButton.waitForDisplayed();
    await this.IntegrationServerButton.click();

    await this.appsHeader.isDisplayed();

    // Remove or add depending on what is configurable in Apps page
    const environments = ['TEST', 'MAINTENANCE', 'PRODUCTION'];

    for (const env of environments) {
      console.log(`\n[DEBUG] ===== Testing Environment: ${env} =====`);
      
      await this.appsDropdown.waitForDisplayed();
      await this.appsDropdown.click();
      await browser.pause(500); 

      const exactVal = env.toUpperCase(); 
      const optionXPath = `//*[@role='listbox']//*[normalize-space()='${exactVal}'] | ` +
                          `//*[@data-radix-popper-content-wrapper]//*[normalize-space()='${exactVal}'] | ` +
                          `//*[@role='option' and normalize-space()='${exactVal}'] | ` +
                          `//*[@role='option']//*[normalize-space()='${exactVal}']`;
                          
      const optionElem = await $(optionXPath);
      await optionElem.waitForDisplayed({ timeout: 5000 });
      try {
          await optionElem.click();
      } catch (e) {
          await browser.execute((el) => (el as HTMLElement).click(), optionElem);
      }

      await browser.pause(2000);

      await this.Apps_Table.waitForDisplayed();

      console.log(`[DEBUG] ===== Backend vs Frontend Validation for ${env} =====`);
      const apiData = await this.fetchApiApps(env);
      
      const uiRowsElements = await this.TableRows;
      const uiRows = [...uiRowsElements];
      console.log(`[DEBUG] [FE] Total rows visible on page for ${env}: ${uiRows.length}`);
      
      if (uiRows.length > 0) {
        console.log(`[DEBUG] [FE] Verifying each row is clickable for ${env}...`);
        for (const row of uiRows) {
          await expect(row).toBeClickable();
        }
      }

      await this.compareBackendToFrontend(apiData, uiRows, env);
    }
  }

  /**
   * Helper to fetch Apps from Backend API (Placeholder)
   */
  private async fetchApiApps(env: string): Promise<any[]> {
    let apiData: any[] = [];
    try {
      const cookies = await browser.getCookies();
      const tokenCookie = cookies.find(c => c.name === 'aip_access_token');
      const token = tokenCookie ? tokenCookie.value : undefined;
      const testdata = getTestData();
      const baseUrl = testdata.URL.replace(/\/$/, '');
      console.log(`[DEBUG] [BE] Base URL: ${baseUrl}`);

      if (token) {
        console.log(`[DEBUG] [BE] Auth token found for env=${env}...`);
        await ApiPage.setupClient(baseUrl, cookies, token);
        
        const response = await ApiPage.getAllServers(env);
        const raw = response.data;
        apiData = Array.isArray(raw)
          ? raw
          : Array.isArray(raw.data)
          ? raw.data
          : Array.isArray(raw.data?.servers)
          ? raw.data.servers
          : raw || [];
          
        console.log(`[DEBUG] [BE] Total Apps returned from API for ${env}: ${apiData.length}`);
        if(apiData.length > 0) {
           console.log(`[DEBUG] [BE] First item keys: ${Object.keys(apiData[0]).join(', ')}`);
        }
      }
    } catch (e) {
      console.error(`[DEBUG] [BE] Failed to fetch backend Apps for ${env}:`, e);
    }
    return apiData;
  }

  /**
   * Helper to compare UI rows with API data (Placeholder)
   */
  private async compareBackendToFrontend(apiData: any[], rowsToVerify: WebdriverIO.Element[], envLabel: string) {
    if (apiData.length > 0 && rowsToVerify.length > 0) {
      const compareCount = Math.min(rowsToVerify.length, apiData.length);
      console.log(`[DEBUG] Comparing first ${compareCount} rows — BE vs FE for ${envLabel}:`);

      for (let i = 0; i < compareCount; i++) {
        const row = rowsToVerify[i];
        const cells = await row.$$('td');
        
        // UI columns placeholder logic
        const uiName = cells[0] ? await cells[0].getText() : 'N/A';
        const uiEnv  = cells[1] ? await cells[1].getText() : 'N/A';
        const uiStatus = cells[2] ? await cells[2].getText() : 'N/A';
        
        const api = apiData[i];
        
        // Adjust these variables once we know the exact keys of the API
        const apiName = api ? String(api.server_name || api.servername || api.name || 'N/A') : 'N/A';
        const apiEnv  = api ? String(api.env || api.environment || 'N/A') : 'N/A';
        const apiStatus = api ? String(api.status || api.state || 'N/A') : 'N/A';

        console.log(`[DEBUG] Row ${i + 1} | API Name: ${apiName} | UI Name: ${uiName}`);
        console.log(`[DEBUG] Row ${i + 1} | API Env: ${apiEnv} | UI Env: ${uiEnv}`);
        console.log(`[DEBUG] Row ${i + 1} | API Status: ${apiStatus} | UI Status: ${uiStatus}`);

        // TODO: Expects can be added here once properties are confirmed matching
        // expect(uiName).toEqual(apiName);
        // expect(uiEnv).toEqual(apiEnv);
      }
    } else {
      console.warn(`[DEBUG] Skipping BE/FE row comparison for ${envLabel}: API rows=${apiData.length}, UI rows=${rowsToVerify.length}`);
    }
  }

  public async verifyCustomAppsPage_ByEnvironment() {
    await this.apps_FromSidebar.click();

    await this.CustomApps.waitForDisplayed();
    await this.CustomApps.click();

    await this.appsHeader.isDisplayed();

    const environments = ['TEST', 'MAINTENANCE', 'PRODUCTION'];

    for (const env of environments) {
      console.log(`\n[DEBUG] ===== Testing Custom Apps Environment: ${env} =====`);
      
      await this.appsDropdown.waitForDisplayed();
      await this.appsDropdown.click();
      await browser.pause(500); 

      const exactVal = env.toUpperCase(); 
      const optionXPath = `//*[@role='listbox']//*[normalize-space()='${exactVal}'] | ` +
                          `//*[@data-radix-popper-content-wrapper]//*[normalize-space()='${exactVal}'] | ` +
                          `//*[@role='option' and normalize-space()='${exactVal}'] | ` +
                          `//*[@role='option']//*[normalize-space()='${exactVal}']`;
                          
      const optionElem = await $(optionXPath);
      await optionElem.waitForDisplayed({ timeout: 5000 });
      try {
          await optionElem.click();
      } catch (e) {
          await browser.execute((el) => (el as HTMLElement).click(), optionElem);
      }

      await browser.pause(2000);

      console.log(`[DEBUG] ===== Backend vs Frontend Validation for Custom Apps ${env} =====`);
      const apiData = await this.fetchApiCustomApps(env);
      
      if (apiData.length === 0) {
        console.log(`[DEBUG] API returned 0 results for ${env}. Verifying UI shows 'No data' message.`);
        await this.NoCustAppFound_msg.waitForDisplayed({ timeout: 5000 });
        await expect(this.NoCustAppFound_msg).toBeDisplayed();
      } else {
        await this.Apps_Table.waitForDisplayed();
        
        const uiRowsElements = await this.TableRows;
        const uiRows = [...uiRowsElements];
        console.log(`[DEBUG] [FE] Total rows visible on page for ${env}: ${uiRows.length}`);
        
        if (uiRows.length > 0) {
          console.log(`[DEBUG] [FE] Verifying each row is clickable for ${env}...`);
          for (const row of uiRows) {
            await expect(row).toBeClickable();
          }
        }

        await this.compareCustomBackendToFrontend(apiData, uiRows, env);
      }
    }
  }

  /**
   * Helper to fetch Custom Apps from Backend API (Placeholder)
   */
  private async fetchApiCustomApps(env: string): Promise<any[]> {
    let apiData: any[] = [];
    try {
      const cookies = await browser.getCookies();
      const tokenCookie = cookies.find(c => c.name === 'aip_access_token');
      const token = tokenCookie ? tokenCookie.value : undefined;
      const testdata = getTestData();
      const baseUrl = testdata.URL.replace(/\/$/, '');

      if (token) {
        console.log(`[DEBUG] [BE] Auth token found for Custom Apps env=${env}...`);
        await ApiPage.setupClient(baseUrl, cookies, token);
        
        const response = await ApiPage.getAllJarApplications(env);
        const raw = response.data;
        apiData = Array.isArray(raw)
          ? raw
          : Array.isArray(raw.data)
          ? raw.data
          : Array.isArray(raw.data?.applications)
          ? raw.data.applications
          : raw || [];
          
        console.log(`[DEBUG] [BE] Total Custom Apps returned from API for ${env}: ${apiData.length}`);
        if(apiData.length > 0) {
           console.log(`[DEBUG] [BE] First item keys: ${Object.keys(apiData[0]).join(', ')}`);
        }
      }
    } catch (e) {
      console.error(`[DEBUG] [BE] Failed to fetch backend Custom Apps for ${env}:`, e);
    }
    return apiData;
  }

  /**
   * Helper to compare Custom App UI rows with API data (Placeholder)
   */
  private async compareCustomBackendToFrontend(apiData: any[], rowsToVerify: WebdriverIO.Element[], envLabel: string) {
    if (apiData.length > 0 && rowsToVerify.length > 0) {
      const compareCount = Math.min(rowsToVerify.length, apiData.length);
      console.log(`[DEBUG] Comparing first ${compareCount} rows — BE vs FE for Custom Apps ${envLabel}:`);

      for (let i = 0; i < compareCount; i++) {
        const row = rowsToVerify[i];
        const cells = await row.$$('td');
        
        // UI Custom App columns: Application, Description, Environment, Status, JMS, Mail, Ping, Last Updated
        const uiAppRaw = cells[0] ? await cells[0].getText() : 'N/A';
        const uiApp = uiAppRaw.split('\n')[0].trim(); // Primary app name (e.g. "AIP-DXNB")
        const uiIp = uiAppRaw.split('\n')[1]?.trim() || 'N/A'; // IP on second line (e.g. "10.36.0.6:4414")
        const uiDesc = cells[1] ? await cells[1].getText() : 'N/A';
        const uiEnv  = cells[2] ? await cells[2].getText() : 'N/A';
        const uiStatus = cells[3] ? await cells[3].getText() : 'N/A';
        const uiJms = cells[4] ? await cells[4].getText() : 'N/A';
        const uiMail = cells[5] ? await cells[5].getText() : 'N/A';
        const uiPing = cells[6] ? await cells[6].getText() : 'N/A';
        
        const api = apiData[i];
        
        // Backend API keys: appname, ip, description, env, status, jms_status, mail_status, ping_status
        const apiApp = api ? String(api.appname || 'N/A') : 'N/A';
        const apiIp  = api ? String(api.ip || 'N/A') : 'N/A';
        const apiDesc = api ? String(api.description || 'N/A') : 'N/A';
        const apiEnv  = api ? String(api.env || 'N/A') : 'N/A';
        const apiStatus = api ? String(api.status || 'N/A') : 'N/A';
        const apiJms = api ? String(api.jms_status || 'N/A') : 'N/A';
        const apiMail = api ? String(api.mail_status || 'N/A') : 'N/A';
        const apiPing = api ? String(api.ping_status || 'N/A') : 'N/A';

        console.log(`[DEBUG] Row ${i + 1} | API App: ${apiApp} | UI App: ${uiApp}`);
        console.log(`[DEBUG] Row ${i + 1} | API IP: ${apiIp} | UI IP: ${uiIp}`);
        console.log(`[DEBUG] Row ${i + 1} | API Desc: ${apiDesc} | UI Desc: ${uiDesc}`);
        console.log(`[DEBUG] Row ${i + 1} | API Env: ${apiEnv} | UI Env: ${uiEnv}`);
        console.log(`[DEBUG] Row ${i + 1} | API Status: ${apiStatus} | UI Status: ${uiStatus}`);
        console.log(`[DEBUG] Row ${i + 1} | API JMS: ${apiJms} | UI JMS: ${uiJms}`);
        console.log(`[DEBUG] Row ${i + 1} | API Mail: ${apiMail} | UI Mail: ${uiMail}`);
        console.log(`[DEBUG] Row ${i + 1} | API Ping: ${apiPing} | UI Ping: ${uiPing}`);

        // Assertions: Compare Backend vs Frontend
        expect(uiApp).toEqual(apiApp);
        expect(uiIp).toEqual(apiIp);
        expect(uiDesc).toContain(apiDesc.substring(0, 30)); // UI may truncate description with "..."
        expect(uiEnv).toEqual(apiEnv);
        expect(uiStatus).toEqual(apiStatus);
        expect(uiJms).toEqual(apiJms);
        expect(uiMail).toEqual(apiMail);
        expect(uiPing).toEqual(apiPing);
      }
    } else {
      console.warn(`[DEBUG] Skipping Custom App BE/FE row comparison for ${envLabel}: API rows=${apiData.length}, UI rows=${rowsToVerify.length}`);
    }
  }
}

export default new AppsPage();
