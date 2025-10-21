import { $ } from '@wdio/globals'
import Page from './page.js';


class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    public get SelectYrRole() {
        return $('//button[@aria-label="Select your role"]');
    }

    public get managerRole() {
        return $(`//option[@value="MANAGER"]`)
    }
    public get userName() {
        return $(`//input[@id="email"]`);
    }

    public get loginPassword() {
        return $('//input[@id="password"]');
    }
    public get ContinueBTN() {
        return $(`//button[text()="Continue"]`)
    }
    public get Dashboardtxt() {
        return $(`//h1[@class="text-3xl font-bold text-foreground"]`)
    }
    public getRole(roleName: string) {
        return $(`//span[text()="${roleName}"]`);
    }

    /**
     * Author: Subrat
     * Date: 21-10-2025
     * TC-Login As Manager
     */
    public async login(username: string, password: string) {
        await this.managerRole.click()
        await this.userName.setValue(username);
        await this.loginPassword.setValue(password);
        await this.ContinueBTN.click();
        await this.Dashboardtxt.isDisplayed();
        await expect(this.Dashboardtxt).toHaveText('Dashboard');
        await expect(this.getRole("MANAGER")).toHaveText("MANAGER");
    }

}

export default new LoginPage();
