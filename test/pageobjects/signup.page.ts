import { $, browser } from '@wdio/globals'
import Page from './page.js';
import ManagePage from "./manage.page.js";


class SignupPage extends Page {

    /**
     * define selectors using getter methods
     */
    public get Signup_link(){
        return $(`//a[text()="Sign up"]`)
    }
    public get selectRole_DDButton(){
        return $(`//button[@id='role']//*[name()='svg']`)
    }

    public get creteyourAcc_Header(){
        return $(`//h3[text()="Create Your Account"]`)
    }
    public get manager_Role() {
        return $(`//option[@value='MANAGER']`)
    }
    public get User_Role() {
        return $(`//option[@value="USER"]`)
    }
    
    public get CreateAcc_btn(){
        return $(`//button[text()="Create Account"]`)
    }
    public get alreadyhave_acc(){
        return $(`//div[text()="Already have an account?"]`)
    }
    public getLabelByText(labelText: string) {
    return $(`//label[text()="${labelText}"]`); //Select Role, Name, Designation, Team, Phone Number, Email, Set Password, Confirm Password
    }
    public getselectrole (selectedRole: string){
        return $(`//span[text()="${selectedRole}"]`)  // User, Manager
    }
    public getSignuptextFiled (SignupInput: string){
        return $(`//span[text()="${SignupInput}"]`)  // Your full Name, Developer, Ph number, EmailId, Set Passwd, Confirm passwd
    }
    public get SelectTeam(){
        return $(`//button[@id='team']//*[name()='svg']`) // Application, Server
    }
    public get SignupSubmit_Btn(){
        return $(`//button[text()="Create Account"]`)
    }

    public inputById(id: string) {
    return $(`//input[@id="${id}"]`);
    }
    public errorMessageByText(message: string) {
    return $(`//p[normalize-space()="${message}"]`);
}
public get accountCreatedSuccessfully() {
    return $(`//h3[text()="Account Created Successfully!"]`);
}
public get SigninToAIPHeader(){
        return $(`//h3[text()='Sign in to AIP Dashboard']`)
    }
    public get AIPLogo() {
        return $(`//img[@alt='AIP Sentinel']`);
    }




    /**
     * Author: Subrat
     * TC-Sign-Up page
     */
private signupErrorMap: Record<string, string> = {
    name: 'Name is required',
    designation: 'Designation is required',
    team: 'Team is required',
    phone: 'Phone number is required',
    email: 'Email is required',
    password: 'Password is required',
    confirmPassword: 'Please confirm your password'
};
public async fillSignupForm(data: {
    name?: string;
    designation?: string;
    team?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}): Promise<void> {

    if (data.name !== undefined) {
        await this.inputById('name').setValue(data.name);
    }

    if (data.designation !== undefined) {
        await this.inputById('designation').setValue(data.designation);
    }

    if (data.team !== undefined) {
        await this.SelectTeam.click();
        await browser.keys([data.team[0], 'Enter']);
    }

    if (data.phone !== undefined) {
        await this.inputById('phone').setValue(data.phone);
    }

    if (data.email !== undefined) {
        await this.inputById('email').setValue(data.email);
    }

    if (data.password !== undefined) {
        await this.inputById('password').setValue(data.password);
    }

    if (data.confirmPassword !== undefined) {
        await this.inputById('confirmPassword').setValue(data.confirmPassword);
    }
}
public async validateInlineErrors(formData: Record<string, string | undefined>) {
    for (const field in this.signupErrorMap) {
        if (!formData[field]) {
            const errorText = this.signupErrorMap[field];
            await expect(this.errorMessageByText(errorText)).toBeDisplayed();
        }
    }
}
public async SignUp_Manager(
    FullName: string,
    Designation: string,
    PhoneNum: string,
    Email: string,
    SetPassword: string
): Promise<void> {

    await this.Signup_link.waitForClickable();
    await this.Signup_link.click();

    // Select Manager role
    await this.selectRole_DDButton.waitForClickable();
    await this.selectRole_DDButton.click();
    await browser.keys(['M', 'Enter']);

    await expect(this.manager_Role).toHaveText('Manager');
    await expect(this.getLabelByText('Name')).toBeDisplayed();

    // Prepare data object
    const signupData = {
        name: FullName,
        designation: Designation,
        team: 'Application',
        phone: PhoneNum,
        email: Email,
        password: SetPassword,
        confirmPassword: SetPassword
    };

    // Fill form
    await this.fillSignupForm(signupData);
    // Submit
    await this.CreateAcc_btn.waitForClickable();
    await this.CreateAcc_btn.click();
    await this.validateInlineErrors(signupData);
    await this.accountCreatedSuccessfully.waitForDisplayed();
    await expect(this.accountCreatedSuccessfully).toBeDisplayed();
    await this.SigninToAIPHeader.waitForDisplayed();
    await expect(this.SigninToAIPHeader).toBeDisplayed();
}


public async SignUp_User(
    FullName: string,
    Designation: string,
    PhoneNum: string,
    Email: string,
    SetPassword: string
): Promise<void> {

    await this.Signup_link.waitForClickable();
    await this.Signup_link.click();

    // Select User role
    await this.selectRole_DDButton.waitForClickable();
    await this.selectRole_DDButton.click();
    await browser.keys(['U', 'Enter']);
    await expect(this.User_Role).toHaveText('User');
    await expect(this.getLabelByText('Name')).toBeDisplayed();

    // Prepare data object
    const signupData = {
        name: FullName,
        designation: Designation,
        team: 'Application',
        phone: PhoneNum,
        email: Email,
        password: SetPassword,
        confirmPassword: SetPassword
    };

    // Fill form
    await this.fillSignupForm(signupData);
    // Submit
    await this.CreateAcc_btn.waitForClickable();
    await this.CreateAcc_btn.click();
    await this.validateInlineErrors(signupData);
    await this.accountCreatedSuccessfully.waitForDisplayed();
    await expect(this.accountCreatedSuccessfully).toBeDisplayed();
    await this.SigninToAIPHeader.waitForDisplayed();
    await expect(this.SigninToAIPHeader).toBeDisplayed();
    await expect(this.SigninToAIPHeader).toBeDisplayed();
}

    

    } 

export default new SignupPage();