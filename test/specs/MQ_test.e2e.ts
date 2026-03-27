import MQPage from "../pageobjects/mq.page.js";
import LoginPage from "../pageobjects/login.page.js";
import { getTestData } from "../utils/dynamicTestData.js";

describe("Verify MQ Page", () => {
  it("Verify MQ PAGE as admin and check the data with API", async () => {
    const testdata = getTestData();
    
    // 1. Login as Admin
    await LoginPage.open(testdata.URL);
    await browser.maximizeWindow();
    await LoginPage.login_Admin(
      testdata.Admin_Username,
      testdata.Admin_Password
    );
    
    // 2. Perform navigation and verify MQ page
    await MQPage.verifyMQPage();
  });

  it("Verify MQ PAGE as MANAGER and check the data with API", async () => {
    const testdata = getTestData();
    
    // 1. Login as Admin
    await LoginPage.open(testdata.URL);
    await browser.maximizeWindow();
    await LoginPage.login_Manager(
      testdata.manager_username,
      testdata.Manager_password
    );
    
    // 2. Perform navigation and verify MQ page
    await MQPage.verifyMQPage();
    await MQPage.verifyMQPage_ByEnvironment();
  });

  it("Should verify MQ page data by filtering environments as Admin", async () => {
    // 3. Perform environment dropdown filter validation and check with API
    await MQPage.verifyMQPage_ByEnvironment();
  });
});
