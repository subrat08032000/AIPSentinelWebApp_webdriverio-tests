import AppsPage from "../pageobjects/apps.page.js";
import LoginPage from "../pageobjects/login.page.js";
import { getTestData } from "../utils/dynamicTestData.js";

describe("[APP002]Verify Apps Page", () => {
  it("[TC002]Verify Apps Page as admin and check the data with API", async () => {
    const testdata = getTestData();
    
    // 1. Login as Admin
    await LoginPage.open(testdata.URL);
    await browser.maximizeWindow();
    await LoginPage.login_Admin(
      testdata.Admin_Username,
      testdata.Admin_Password
    );
    // 2. Perform navigation and verify Apps page
    await AppsPage.verifyAppsPage();
    await AppsPage.verifyCustomAppsPage_ByEnvironment();
  });

  it("[TC003]Verify Apps PAGE as MANAGER and check the data with API", async () => {
    const testdata = getTestData();
    // 1. Login as Manager
    await LoginPage.open(testdata.URL);
    await browser.maximizeWindow();
    await LoginPage.login_Manager(
      testdata.manager_username,
      testdata.Manager_password
    );
    
    // 2. Perform navigation and verify Apps page
    await AppsPage.verifyAppsPage();
    await AppsPage.verifyAppsPage_ByEnvironment();
  });

  it("[TC004]Should verify Apps page data by filtering environments as Admin", async () => {
    // 3. Perform environment dropdown filter validation and check with API
    await AppsPage.verifyAppsPage_ByEnvironment();
  });

  it("[TC005]Should verify Custom Apps page data by filtering environments", async () => {
    // 4. Perform Custom Apps dropdown filter validation and check with API
    await AppsPage.verifyCustomAppsPage_ByEnvironment();
  });
});
