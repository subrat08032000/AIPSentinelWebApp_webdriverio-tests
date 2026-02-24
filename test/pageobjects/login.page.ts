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
  public get ProfileButtonGeneric() {
    // Try to find a button in the header/top-right that looks like a profile button
    return $(`//button[.//span[string-length(text()) <= 3]] | //button[contains(@class, 'rounded-full')]`);
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
    await this.selectrole.waitForDisplayed();
    await this.selectrole.waitForClickable();
    await this.selectrole.click();
    
    const roleManager = await this.getRole("Manager");
    await roleManager.waitForClickable();
    await roleManager.click();
    
    // Ensure form is ready for input after role selection
    await this.userName.waitForDisplayed();
    await this.userName.waitForEnabled();
    await this.userName.setValue(username);
    await this.loginPassword.waitForDisplayed();
    await this.loginPassword.waitForEnabled();
    await this.loginPassword.setValue(password);
    
    // Using isClickable/isEnabled as checks (not waiting)
    await this.forgotpwd_link.isClickable();
    await this.Signup_link.isClickable();
    
    await this.ContinueBTN.waitForClickable();
    await expect(this.DonthaveAcc_placeholder).toHaveText(
      expect.stringContaining("Don't have an account?")
    );
    await this.ContinueBTN.click();
    
    await this.Dashboardtxt.waitForDisplayed({ timeout: 15000 });
    await expect(this.Dashboardtxt).toHaveText(expect.stringMatching(/Dashboard/i));
    
    // Case-insensitive role check
    const roleDisplay = await this.getRole("MANAGER");
    await roleDisplay.waitForDisplayed();
    const roleText = (await roleDisplay.getText()).toUpperCase();
    expect(roleText).toBe("MANAGER");
  }

  public async login_Admin(username: string, password: string) {
    await this.selectrole.waitForDisplayed();
    await this.selectrole.waitForClickable();
    await this.selectrole.click();
    
    const roleAdmin = await this.getRole("Admin");
    await roleAdmin.waitForClickable();
    await roleAdmin.click();
    
    await this.userName.waitForDisplayed();
    await this.userName.waitForEnabled();
    await this.userName.setValue(username);
    await this.loginPassword.waitForDisplayed();
    await this.loginPassword.waitForEnabled();
    await this.loginPassword.setValue(password);
    
    await this.ContinueBTN.waitForClickable();
    await this.ContinueBTN.click();
    
    await this.Dashboardtxt.waitForDisplayed({ timeout: 15000 });
    await expect(this.Dashboardtxt).toHaveText(expect.stringMatching(/Dashboard/i));
    
    const roleDisplay = await this.getRole("ADMIN");
    await roleDisplay.waitForDisplayed();
    const roleText = (await roleDisplay.getText()).toUpperCase();
    expect(roleText).toBe("ADMIN");
  }

  public async logout(role?: "Manager" | "Admin" | "User"): Promise<void> {
    // Try specific role-based button first (legacy support), then generic
    let profileButton: ChainablePromiseElement;
    
    if (role === "Manager") profileButton = this.Profilebutton_Manager;
    else if (role === "Admin") profileButton = this.Profilebutton_Admin;
    else if (role === "User") profileButton = this.Profilebutton_User;
    else profileButton = this.ProfileButtonGeneric;

    // Fallback to generic if specific one is not found or not clickable
    if (!(await profileButton.isDisplayed())) {
        profileButton = this.ProfileButtonGeneric;
    }

    await profileButton.waitForClickable({ timeout: 5000 });
    await profileButton.click();
    await this.LogoutBtn.waitForClickable({ timeout: 5000 });
    await this.LogoutBtn.click();
    await this.SigninToAIPHeader.waitForDisplayed();
  }
  public async login_User(username: string, password: string) {
    await this.selectrole.waitForDisplayed();
    await this.selectrole.waitForClickable();
    await this.selectrole.click();
    
    await this.UserRole.waitForClickable();
    await this.UserRole.click();
    
    await this.userName.waitForDisplayed();
    await this.userName.waitForEnabled();
    await this.userName.setValue(username);
    await this.loginPassword.waitForDisplayed();
    await this.loginPassword.waitForEnabled();
    await this.loginPassword.setValue(password);
    
    await this.ContinueBTN.waitForClickable();
    await this.ContinueBTN.click();
    
    await this.Dashboardtxt.waitForDisplayed({ timeout: 15000 });
    await expect(this.Dashboardtxt).toHaveText(expect.stringMatching(/Dashboard/i));
    
    const roleDisplay = await this.getRole("USER");
    await roleDisplay.waitForDisplayed();
    const roleText = (await roleDisplay.getText()).toUpperCase();
    expect(roleText).toBe("USER");
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
