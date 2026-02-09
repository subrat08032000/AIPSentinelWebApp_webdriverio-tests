import LoginPage from "../pageobjects/login.page.js";
import { getTestData } from "../utils/dynamicTestData.js";
import SignupPage from "../pageobjects/signup.page.js";
import managePage from "../pageobjects/manage.page.js";

describe("Verify the sign-up Page", () => {
  it.only("Signup As manager and check inline error message if any filed is missing", async () => {
    const testdata = getTestData();

    await LoginPage.open(testdata.URL);
    await browser.maximizeWindow();
    await SignupPage.SignUp_Manager(
      testdata.Fullname,
      testdata.Designation,
      testdata.Phone,
      testdata.Email,
      testdata.SetPassword,
    );
     await LoginPage.login_Admin(
      testdata.Admin_Username,
      testdata.Admin_Password,
    );
    await managePage.clickManageApprovals();
    await managePage.rejectManagersStartingWithPrefix("Test");
    
    // Check for "No user requests found."
    if (await managePage.tableRows.length === 0) {
      await expect(managePage.noUserRequestsFound).toBeDisplayed();
    }
    
    await managePage.rejectManagersStartingWithPrefix(testdata.Fullname);
  });

  it("Signup As User and check inline error message if any filed is missing", async () => {
    const testdata = getTestData();
    await LoginPage.open(testdata.URL);
    await browser.maximizeWindow();
    await SignupPage.SignUp_User(
      testdata.Fullname,
      testdata.Designation,
      testdata.Phone,
      testdata.Email,
      testdata.SetPassword,
    );
    await LoginPage.login_Admin(
      testdata.Admin_Username,
      testdata.Admin_Password,
    );
    await managePage.clickManageApprovals();
    await managePage.rejectManagersStartingWithPrefix("Test");

    // Check for "No user requests found."
    if (await managePage.tableRows.length === 0) {
      await expect(managePage.noUserRequestsFound).toBeDisplayed();
    }
    
    await managePage.rejectManagersStartingWithPrefix(testdata.Fullname);
  });
});
