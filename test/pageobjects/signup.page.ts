import { $ } from '@wdio/globals'
import Page from './page.js';
//import ManagePage from "./manage.page.js";


class SignupPage extends Page {

    /**
     * define selectors using getter methods
     */
    public get Signup_link(){
        return $(`//a[text()="Sign up"]`)
    }
    public get selectRole_DDButton(){
        return $(`//button[@id='role']`)
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
        return $(`//button[@id='team']`) // Application, Server
    }
    public get SignupSubmit_Btn(){
        return $(`//button[text()="Create Account"]`)
    }
    public get selectManager_DDButton(){
        return $(`//button[@id='manager_id'] | //button[@id='manager']`)
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

    public getTeamOption(teamName: string) {
        return $(`//span[text()="${teamName}"] | //div[@role='option']//span[text()="${teamName}"]`);
    }

    public get managerRoleOption() {
        return $(`//span[text()='Manager'] | //div[@role='option']//span[text()='Manager']`);
    }

    public get userRoleOption() {
        return $(`//span[text()='User'] | //div[@role='option']//span[text()='User']`);
    }

    public getSpecificManagerOption(managerEmail: string) {
        return $(`//span[text()='${managerEmail}'] | //div[@role='option']//span[text()='${managerEmail}']`);
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

        const teamOption = this.getTeamOption(data.team);
        await teamOption.waitForClickable();
        await teamOption.click();
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
    await this.selectRole_DDButton.waitForExist();
    await this.selectRole_DDButton.click();

    
    const managerRoleOption = this.managerRoleOption;
    await managerRoleOption.waitForClickable();
    await managerRoleOption.click();

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
    
    console.log(`[DEBUG] Signup submitted for ${Email}. Waiting for success message...`);
    
    // Increased timeout for signup success as it can be slow
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
    SetPassword: string,
    managerEmail: string
): Promise<void> {

    await this.Signup_link.waitForClickable();
    await this.Signup_link.click();

    // Select User role
    await this.selectRole_DDButton.waitForExist();
    await this.selectRole_DDButton.click();

    
    const userOption = this.userRoleOption;
    await userOption.waitForClickable();
    await userOption.click();
    
    // Brief wait to ensure selection is processed


    // Select Manager
    await this.selectManager_DDButton.waitForExist();
    await this.selectManager_DDButton.scrollIntoView();
    await this.selectManager_DDButton.click();


    const managerOption = this.getSpecificManagerOption(managerEmail);
    await managerOption.waitForExist();
    await managerOption.scrollIntoView();
    
    // Wait for it to be clickable with a slight retry if it fails initially
    try {
        await managerOption.waitForClickable();
    } catch (error) {
        console.log(`[DEBUG] Manager option not clickable initially, trying one more time with a small pause...`);

        await managerOption.waitForClickable();
    }
    
    await managerOption.click();



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

    console.log(`[DEBUG] Signup submitted for ${Email}. Waiting for success message...`);

    // Increased timeout for signup success as it can be slow
    await this.accountCreatedSuccessfully.waitForDisplayed();
    await expect(this.accountCreatedSuccessfully).toBeDisplayed();
    await this.SigninToAIPHeader.waitForDisplayed();
    await expect(this.SigninToAIPHeader).toBeDisplayed();
}

    

    } 

export default new SignupPage();