// import { expect } from '@wdio/globals'
import LoginPage from "../pageobjects/login.page.js";
// import SecurePage from '../pageobjects/secure.page.js'
import testdata from "../pageobjects/testdata.json" with { type: "json" };

describe("[Login004] Verify the Login page", () => {
  it("[TC009]Manager should able to login with valid credentials", async () => {
    await LoginPage.open(testdata.URL);
    await browser.maximizeWindow();
    await LoginPage.login_Manager(
      testdata.manager_username,
      testdata.Manager_password,
    );
    await LoginPage.logout("Manager");
  });

  it("[TC010]Admin should able to login with valid credentials", async () => {
    await LoginPage.open(testdata.URL);
    await browser.maximizeWindow();
    await LoginPage.login_Admin(
      testdata.Admin_Username,
      testdata.Admin_Password,
    );
    await LoginPage.logout("Admin");
  });

  it("[TC011]User should able to login with valid credentials", async () => {
    await LoginPage.open(testdata.URL);
    await browser.maximizeWindow();
    await LoginPage.login_User(testdata.User_Username, testdata.User_Password);
    await LoginPage.logout("User");
  });
  //validation required assertions
  it("[TC012]Verify the functionality of Forgot password link and page asthetics of forgot password page.", async () => {
    await LoginPage.open(testdata.URL);
    await browser.maximizeWindow();
    await LoginPage.forgotPassword(testdata.Admin_Username);
  });

  it("[TC013]Verify that user enter unregistered email for forgot password", async () => {
    await LoginPage.open(testdata.URL);
    await browser.maximizeWindow();
    await LoginPage.forgotPassword_Unreg_Email(testdata.UnregisteredEmail);
  });
});
