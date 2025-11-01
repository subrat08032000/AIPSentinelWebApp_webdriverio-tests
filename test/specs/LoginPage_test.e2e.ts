// import { expect } from '@wdio/globals'
import loginPage from '../pageobjects/login.page.js';
import LoginPage from '../pageobjects/login.page.js'
// import SecurePage from '../pageobjects/secure.page.js'
import testdata from '../pageobjects/testdata.json';

describe('[TS_Login_02] Verify the Login page', () => {
    
    it('Manager should able to login with valid credentials', async () => {
        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        await LoginPage.login_Manager(testdata.manager_username,testdata.Manager_password);
        await loginPage.logout('Manager')
    })

    it('Admin should able to login with valid credentials', async () => {
        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        await LoginPage.login_Admin(testdata.Admin_Username,testdata.Admin_Password);
        await loginPage.logout('Admin')
    })

    it('User should able to login with valid credentials', async () => {
        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        await LoginPage.login_User(testdata.Admin_Username,testdata.Admin_Password);
        await loginPage.logout('User')
    })
//validation required assertions
    it('Verify the functionality of Forgot password link and page asthetics of forgot password page.', async ()=> {
        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        await loginPage.forgotPassword(testdata.Admin_Username)
    })

    it('Verify that user enter unregistered email for forgot password', async ()=> {
        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        await loginPage.forgotPassword_Unreg_Email(testdata.UnregisteredEmail)
    })


})

