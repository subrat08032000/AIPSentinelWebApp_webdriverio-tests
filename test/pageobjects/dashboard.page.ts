import { $ } from '@wdio/globals';
import Page from './page.js';

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
    
}

export default new DashboardPage();
