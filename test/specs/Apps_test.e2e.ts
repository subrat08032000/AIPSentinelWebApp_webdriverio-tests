import AppsPage from "../pageobjects/apps.page.ts";
import LoginPage from "../pageobjects/login.page.js";
import { getTestData } from "../utils/dynamicTestData.js";

describe("Verify Apps Page", () => {
  it.only("Verify Apps Page as admin and check the data with API", async () => {
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

  it("Verify Apps PAGE as MANAGER and check the data with API", async () => {
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

  it("Should verify Apps page data by filtering environments as Admin", async () => {
    // 3. Perform environment dropdown filter validation and check with API
    await AppsPage.verifyAppsPage_ByEnvironment();
  });

  it("Should verify Custom Apps page data by filtering environments", async () => {
    // 4. Perform Custom Apps dropdown filter validation and check with API
    await AppsPage.verifyCustomAppsPage_ByEnvironment();
  });
});
