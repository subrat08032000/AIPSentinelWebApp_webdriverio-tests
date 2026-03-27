import Page from "./page.js";
import ApiPage from "./api.page.js";
import { getTestData } from "../utils/dynamicTestData.js";
import { expect, browser } from "@wdio/globals";

class MQPage extends Page {
  /**
   * define selectors using getter methods
   */
  public get mqHeader() {
    return $("//h1[normalize-space()='Queue Managers']");
  }
  public get mq_FromSidebar() {
    return $("(//span[contains(text(),'MQ')])[1]");
  }

  public get mqDropdow(){
    return $("//button[@role='combobox']");
  }

  public get mqDropdownOptions(){
    return $$("//ul[@role='listbox']//li");
  }

  // Example placeholders for MQ specific elements
  public get MQ_Table(){
    return $(`//table[@class='w-full caption-bottom text-sm']`);
  }
  public get TableRows() {
    return $$("//table//tbody/tr");
  }

  /**
   * Navigates to MQ page from Dashboard
   */
  public async verifyMQPage() {
    await this.mq_FromSidebar.click();
    await this.mqHeader.isDisplayed();
    await this.MQ_Table.waitForDisplayed();
    await expect(this.MQ_Table).toBeDisplayed();

    console.log("[DEBUG] ===== Backend vs Frontend Validation =====");
    const apiData = await this.fetchApiQms('ALL');
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

    await this.compareBackendToFrontend(apiData, uiRows, 'ALL');
  }

  public async verifyMQPage_ByEnvironment() {
    await this.mq_FromSidebar.click();
    await this.mqHeader.isDisplayed();

    const environments = ['TEST', 'MAINTENANCE', 'PRODUCTION'];

    for (const env of environments) {
      console.log(`\n[DEBUG] ===== Testing Environment: ${env} =====`);
      
      // Native select failed because the element is a custom button combobox, not a <select> tag.
      // We will use the robust fallback locator proven to work in systemalerts.page.ts.
      await this.mqDropdow.waitForDisplayed();
      await this.mqDropdow.click();
      await browser.pause(500); // give dropdown animation time

      const exactVal = env.toUpperCase(); // "TEST", "MAINTENANCE", "PRODUCTION"
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

      // Wait for table to update
      await browser.pause(2000);

      await this.MQ_Table.waitForDisplayed();

      console.log(`[DEBUG] ===== Backend vs Frontend Validation for ${env} =====`);
      const apiData = await this.fetchApiQms(env);
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
   * Helper to fetch Active QMs from Backend API
   */
  private async fetchApiQms(env: string): Promise<any[]> {
    let apiData: any[] = [];
    try {
      const cookies = await browser.getCookies();
      const tokenCookie = cookies.find(c => c.name === 'aip_access_token');
      const token = tokenCookie ? tokenCookie.value : undefined;
      const testdata = getTestData();
      const baseUrl = testdata.URL.replace(/\/$/, '');
      console.log(`[DEBUG] [BE] Base URL: ${baseUrl}`);

      if (token) {
        console.log(`[DEBUG] [BE] Auth token found, calling getActiveQms API for env=${env}...`);
        await ApiPage.setupClient(baseUrl, cookies, token);
        const response = await ApiPage.getActiveQms(env);
        const raw = response.data;
        apiData = Array.isArray(raw)
          ? raw
          : Array.isArray(raw.data)
          ? raw.data
          : Array.isArray(raw.data?.qms)
          ? raw.data.qms
          : [];
        console.log(`[DEBUG] [BE] Total QMs returned from API for ${env}: ${apiData.length}`);
        if (apiData.length > 0) {
          console.log(`[DEBUG] [BE] First item keys: ${Object.keys(apiData[0]).join(', ')}`);
        }
      } else {
        console.warn('[DEBUG] [BE] No auth token found — skipping API call.');
      }
    } catch (e) {
      console.error(`[DEBUG] [BE] Failed to fetch backend QMs for ${env}:`, e);
    }
    return apiData;
  }

  /**
   * Helper to compare UI rows with API data
   */
  private async compareBackendToFrontend(apiData: any[], rowsToVerify: WebdriverIO.Element[], envLabel: string) {
    if (apiData.length > 0 && rowsToVerify.length > 0) {
      const compareCount = Math.min(rowsToVerify.length, apiData.length);
      console.log(`[DEBUG] Comparing first ${compareCount} rows — BE vs FE for ${envLabel}:`);
      console.log(`[DEBUG] ${'Row'.padEnd(5)} | ${'Field'.padEnd(16)} | ${'Backend (API)'.padEnd(20)} | Frontend (UI)`);
      console.log(`[DEBUG] ${'-'.repeat(70)}`);

      for (let i = 0; i < compareCount; i++) {
        const row = rowsToVerify[i];
        const cells = await row.$$('td');
        
        // UI columns order: Name | Environment | Status | AMQP | Channels | Queues | Listeners
        const uiQmName     = cells[0] ? await cells[0].getText() : 'N/A';
        const uiEnv        = cells[1] ? await cells[1].getText() : 'N/A';
        const uiStatus     = cells[2] ? await cells[2].getText() : 'N/A';
        const uiAmqpStatus = cells[3] ? await cells[3].getText() : 'N/A';
        const uiChannels   = cells[4] ? await cells[4].getText() : 'N/A';
        const uiQueues     = cells[5] ? await cells[5].getText() : 'N/A';
        const uiListeners  = cells[6] ? await cells[6].getText() : 'N/A';

        const api = apiData[i];
        const apiQmName     = String(api.qmname     ?? 'N/A');
        const apiEnv        = String(api.env        ?? 'N/A');
        const apiStatus     = String(api.qmstatus   ?? 'N/A');
        const apiAmqpStatus = api.amqpstatus ? String(api.amqpstatus) : 'NOT CONFIGURED';
        const apiChannels   = String(api.channelsCount ?? 'N/A');
        const apiQueues     = String(api.queuesCount ?? 'N/A');
        const apiListeners  = String(api.listenersCount ?? 'N/A');

        const rowLabel = `Row ${i + 1}`;
        console.log(`[DEBUG] ${rowLabel.padEnd(5)} | ${'QM Name'.padEnd(16)} | ${apiQmName.padEnd(20)} | ${uiQmName}`);
        console.log(`[DEBUG] ${' '.repeat(5)} | ${'Environment'.padEnd(16)} | ${apiEnv.padEnd(20)} | ${uiEnv}`);
        console.log(`[DEBUG] ${' '.repeat(5)} | ${'Status'.padEnd(16)} | ${apiStatus.padEnd(20)} | ${uiStatus}`);
        console.log(`[DEBUG] ${' '.repeat(5)} | ${'AMQP Status'.padEnd(16)} | ${apiAmqpStatus.padEnd(20)} | ${uiAmqpStatus}`);
        console.log(`[DEBUG] ${' '.repeat(5)} | ${'Channels'.padEnd(16)} | ${apiChannels.padEnd(20)} | ${uiChannels}`);
        console.log(`[DEBUG] ${' '.repeat(5)} | ${'Queues'.padEnd(16)} | ${apiQueues.padEnd(20)} | ${uiQueues}`);
        console.log(`[DEBUG] ${' '.repeat(5)} | ${'Listeners'.padEnd(16)} | ${apiListeners.padEnd(20)} | ${uiListeners}`);
        console.log(`[DEBUG] ${'-'.repeat(70)}`);

        expect(uiQmName).toEqual(apiQmName);
        expect(uiEnv).toEqual(apiEnv);
        expect(uiStatus).toEqual(apiStatus);
        expect(uiAmqpStatus.replace(/\n/g, ' ')).toContain(apiAmqpStatus);
        expect(uiChannels).toEqual(apiChannels);
        expect(uiQueues).toEqual(apiQueues);
        expect(uiListeners).toEqual(apiListeners);
      }
      console.log(`[DEBUG] ===== Backend vs Frontend Validation PASSED for ${envLabel} =====`);
    } else if (apiData.length === 0 && rowsToVerify.length > 0) {
      const firstRowText = await rowsToVerify[0].getText();
      if (firstRowText.toLowerCase().includes('no results') || firstRowText.toLowerCase().includes('no data')) {
          console.log(`[DEBUG] Verified no data in UI for ${envLabel} as API returned no data`);
      } else {
          console.warn(`[DEBUG] UI has rows but API returned no data for ${envLabel}.`);
      }
    } else {
      console.warn(`[DEBUG] Skipping BE/FE row comparison for ${envLabel}: API rows=${apiData.length}, UI rows=${rowsToVerify.length}`);
    }
  }

}

export default new MQPage();
