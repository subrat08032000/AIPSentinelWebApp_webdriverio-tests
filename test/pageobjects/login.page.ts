import { $ } from "@wdio/globals";
import Page from "./page.js";

class LoginPage extends Page {
  /**
   * define selectors using getter methods
   */
  public get SelectYrRole() {
    return $('//button[@aria-label="Select your role"]');
  }

  public get managerRole() {
    return $(`//option[@value="MANAGER"]`);
  }
  public get AdminRole() {
    return $(`//option[@value="ADMIN"]`);
  }
  public get UserRole() {
    return $(`//span[text()="User"]`);
  }
  public get userName() {
    return $(`//input[@id="email"]`);
  }

  public get loginPassword() {
    return $('//input[@id="password"]');
  }
  public get ContinueBTN() {
    return $(`//button[text()="Continue"]`);
  }
  public get Dashboardtxt() {
    return $(`//h1[normalize-space()='Dashboard']`);
  }
  public getRole(roleName: string) {
    return $(`//span[text()="${roleName}"]`);
  }
  public get Profilebutton_Manager() {
    return $(`//span[text()='SU']`);
  }
  public get Profilebutton_Admin() {
    return $(`//span[text()='AI']`);
  }

  public get Profilebutton_User() {
    return $(`//span[text()='VE']`);
  }

  public get LogoutBtn() {
    return $(`//span[text()='Logout']`);
  }
  public get SigninToAIPHeader() {
    return $("//h3[text()='Sign in to AIP Dashboard']");
  }
  public get forgotpwd_link() {
    return $(`//a[text()="Forgot password?"]`);
  }
  public get Signup_link() {
    return $(`//a[text()="Sign up"]`);
  }
  public get DonthaveAcc_placeholder() {
    return $(`//div[text()="Don't have an account?"]`);
  }
  public get forgotpwd_Headertxt() {
    return $(`//h3[text()="Forgot Password"]`);
  }
  public get forgotpwd_Bodytxt() {
    return $(
      `//p[text()="Enter your email address and we'll send you a reset link"]`,
    );
  }
  public get forgotpwsEmail_label() {
    return $(`//label[text()="Email Address"]`);
  }
  public get forgotpwsEmail_field() {
    return $(`//input[@type="email"]`);
  }
  public get forgotpwsSendResetLink_BTN() {
    return $(`//button[text()="Send Reset Link"]`);
  }
  public get forgotpwsBacktoLogin_BTN() {
    return $(`//a[text()="Back to login"]`);
  }
  public get Unregisteruser() {
    return $(`//div[text()="User not found"]`);
  }
  public get selectrole() {
    return $(`#role`);
  }

  /**
   * Author: Subrat
   * TC-Login Page
   */
  public async login_Manager(username: string, password: string) {
    await this.selectrole.waitForDisplayed({ timeout: 10000 });
    await this.selectrole.waitForClickable({ timeout: 10000 });
    await this.selectrole.click();
    await this.getRole("Manager").click();
    await this.userName.setValue(username);
    await this.loginPassword.setValue(password);
    await this.forgotpwd_link.isClickable();
    await this.Signup_link.isClickable();
    await this.ContinueBTN.isEnabled();
    await expect(this.DonthaveAcc_placeholder).toHaveText(
      "Don't have an account? Sign up",
    );
    await this.ContinueBTN.click();
    await this.Dashboardtxt.isDisplayed();
    await expect(this.Dashboardtxt).toHaveText("Dashboard");
    await expect(this.getRole("MANAGER")).toHaveText("MANAGER");
  }
  public async login_Admin(username: string, password: string) {
    await this.selectrole.waitForDisplayed({ timeout: 10000 });
    await this.selectrole.waitForClickable({ timeout: 10000 });
    await this.selectrole.click();
    await this.getRole("Admin").click();
    await this.userName.setValue(username);
    await this.loginPassword.setValue(password);
    await this.forgotpwd_link.isClickable();
    await this.Signup_link.isClickable();
    await this.ContinueBTN.isEnabled();
    await expect(this.DonthaveAcc_placeholder).toHaveText(
      "Don't have an account? Sign up",
    );
    await this.ContinueBTN.click();
    await this.Dashboardtxt.isDisplayed();
    await expect(this.Dashboardtxt).toHaveText("Dashboard");
    await expect(this.getRole("ADMIN")).toHaveText("ADMIN");
  }

  public async logout(role: "Manager" | "Admin" | "User"): Promise<void> {
    const profileButton =
      role === "Manager"
        ? this.Profilebutton_Manager
        : role === "Admin"
          ? this.Profilebutton_Admin
          : role === "User"
            ? this.Profilebutton_User
            : this.Profilebutton_User;

    await profileButton.click();
    await this.LogoutBtn.click();
    await this.SigninToAIPHeader.waitForDisplayed({ timeout: 10000 });
  }
  public async login_User(username: string, password: string) {
    await this.selectrole.waitForDisplayed({ timeout: 10000 });
    await this.selectrole.waitForClickable({ timeout: 10000 });
    await this.selectrole.click();
    await this.UserRole.click();
    await this.userName.setValue(username);
    await this.loginPassword.setValue(password);
    await this.forgotpwd_link.isClickable();
    await this.Signup_link.isClickable();
    await this.ContinueBTN.isEnabled();
    await expect(this.DonthaveAcc_placeholder).toHaveText(
      "Don't have an account? Sign up",
    );
    await this.ContinueBTN.click();
    await this.Dashboardtxt.isDisplayed();
    await expect(this.Dashboardtxt).toHaveText("Dashboard");
    await expect(this.getRole("USER")).toHaveText("USER");
  }

  public async forgotPassword(username: string) {
    await this.forgotpwd_link.click();
    await this.forgotpwd_Headertxt.waitForDisplayed();
    await this.forgotpwd_Bodytxt.waitForDisplayed();
    await this.forgotpwsEmail_label.waitForDisplayed();
    await this.forgotpwsEmail_field.waitForEnabled();
    await this.forgotpwsEmail_field.setValue(username);
    await this.forgotpwsSendResetLink_BTN.waitForClickable();
    await this.forgotpwsSendResetLink_BTN.click();
    await this.forgotpwsBacktoLogin_BTN.waitForClickable();
    await this.forgotpwsBacktoLogin_BTN.click();
  }
  public async forgotPassword_Unreg_Email(username: string) {
    await this.forgotpwd_link.click();
    await this.forgotpwsEmail_field.setValue(username);
    await this.forgotpwsSendResetLink_BTN.click();
    await expect(this.Unregisteruser).toHaveText("User not found");
  }
}

export default new LoginPage();
