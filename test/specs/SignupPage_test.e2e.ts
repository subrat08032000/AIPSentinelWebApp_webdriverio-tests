import LoginPage from "../pageobjects/login.page.js";
import SignupPage from "../pageobjects/signup.page.js";
import managePage from "../pageobjects/manage.page.js";
import { getTestData } from "../utils/dynamicTestData.js";
import loginPage from "../pageobjects/login.page.js";

describe("Signup and manage approvals", () => {
    it("Signup As manager and check approval workflow", async () => {
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

        // Reject any existing dummy managers
        await managePage.rejectManagersStartingWithPrefix("Test", false);

        // Reject the newly created manager
        await managePage.rejectManagersStartingWithPrefix(testdata.Fullname, true);

        await LoginPage.logout("Admin");
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
      testdata.manager_username
    );
    await LoginPage.login_Admin(
      testdata.Admin_Username,
      testdata.Admin_Password,
    );
    await managePage.clickManageApprovals();

    console.log("--- START MULTI-USER REJECTION ---");
    // This will reject ALL users matching "Test" one by one
    await managePage.rejectUsersStartingWithPrefix("Test", false);
    
    // Finally reject the specific user we just created
    await managePage.rejectUsersStartingWithPrefix(testdata.Fullname, true);
    console.log("--- END MULTI-USER REJECTION ---");

    await loginPage.logout("Admin");
  });
});
