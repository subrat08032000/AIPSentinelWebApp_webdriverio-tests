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
})

