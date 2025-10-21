// import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
// import SecurePage from '../pageobjects/secure.page.js'
import testdata from '../pageobjects/testdata.json';

describe('[TS_Login_02] Verify the Login page', () => {
    
    it('should login with valid credentials', async () => {
        await LoginPage.open(testdata.URL);
        await browser.maximizeWindow();
        await LoginPage.login(testdata.manager_username,testdata.Manager_password);
    })
})

