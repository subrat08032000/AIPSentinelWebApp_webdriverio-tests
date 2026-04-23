import SystemAlertsPage from "../pageobjects/systemalerts.page.js";
import LoginPage from "../pageobjects/login.page.js";
import { getTestData } from "../utils/dynamicTestData.js";

describe("[SystemAlert008]Verify System Alerts Page", () => {
  it("[01]Should navigate to System Alerts page via Dashboard 'Show more' button", async () => {
    const testdata = getTestData();
    
    // 1. Login as Admin
    await LoginPage.open(testdata.URL);
    await browser.maximizeWindow();
    await LoginPage.login_Admin(
      testdata.Admin_Username,
      testdata.Admin_Password
    );
    // 2. Perform navigation and verification via Page Object
    await SystemAlertsPage.verifyNavigationFromDashboard();

    // 3. Verify Alerts table, filters and backend API consistency
    await SystemAlertsPage.verifyAlertsTableIsDisplayed();
  });
});
