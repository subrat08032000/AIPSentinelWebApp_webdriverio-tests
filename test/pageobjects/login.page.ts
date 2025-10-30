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
    public get AdminRole() {
        return $(`//option[@value="ADMIN"]`)
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
    public get Profilebutton_Manager(){
        return $(`//span[text()='SU']`)
    }
     public get Profilebutton_Admin(){
        return $(`//span[text()='AI']`)
    }

    public get LogoutBtn(){
        return $(`//span[text()='Logout']`)
    }
    public get SigninToAIPHeader(){
        return $("//h3[text()='Sign in to AIP Dashboard']")
    }

    /**
     * Author: Subrat
     * TC-Login As Manager
     */
    public async login_Manager(username: string, password: string) {
        await this.managerRole.click()
        await this.userName.setValue(username);
        await this.loginPassword.setValue(password);
        await this.ContinueBTN.click();
        await this.Dashboardtxt.isDisplayed();
        await expect(this.Dashboardtxt).toHaveText('Dashboard');
        await expect(this.getRole("MANAGER")).toHaveText("MANAGER");
    }
public async login_Admin(username: string, password: string) {
        await this.AdminRole.click()
        await this.userName.setValue(username);
        await this.loginPassword.setValue(password);
        await this.ContinueBTN.click();
        await this.Dashboardtxt.isDisplayed();
        await expect(this.Dashboardtxt).toHaveText('Dashboard');
        await expect(this.getRole("ADMIN")).toHaveText("ADMIN");
    }


public async logout(role: "Manager" | "Admin" | "User"): Promise<void> {
    const profileButton = role === "Manager" ? this.Profilebutton_Manager : this.Profilebutton_Admin;

    await profileButton.click();
    await this.LogoutBtn.click();
    await this.SigninToAIPHeader.isElementDisplayed("Sign in to AIP DashboardSign in to AIP Dashboard")
    }
}





export default new LoginPage();
