import LoginPage from "../pageobjects/login.page.js";
import SignupPage from "../pageobjects/signup.page.js";
import managePage from "../pageobjects/manage.page.js";
import { getTestData } from "../utils/dynamicTestData.js";

describe("Signup and manage approvals", () => {
    it("Signup As Manager and check manager rejection flow as Admin", async () => {
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
        console.log("--- START MULTI-MANAGER REJECTION ---");
        // Reject any existing dummy managers
        await managePage.cleanupTestManagers();
        // Reject the newly created manager
        await managePage.rejectManagersStartingWithPrefix(testdata.Fullname, true);
        console.log("--- END MULTI-MANAGER REJECTION ---");

        await LoginPage.logout("Admin");
    });

    it("Signup As User and check user rejection flow as Admin", async () => {
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

        await LoginPage.logout("Admin");
    });

    it("Signup As Manager and check manager approval flow as Admin", async () => {
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
        console.log("--- START MANAGER APPROVAL ---");
        await managePage.approveManager(testdata.Fullname);
        console.log("--- END MANAGER APPROVAL ---");
        await managePage.DeleteManagerFromManageOrganization(testdata.Fullname);
        await LoginPage.logout("Admin");
    });

    it("Signup As User and check user approval flow as Admin", async () => {
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
        console.log("--- START MULTI-USER APPROVAL ---");
        // This will Approve ALL users matching "Test" one by one
        await managePage.approveUsersStartingWithPrefix("Test", false);
        // Finally Approve the specific user we just created
        await managePage.approveUsersStartingWithPrefix(testdata.Fullname, true);
        console.log("--- END MULTI-USER APPROVAL ---");
        await managePage.DeleteUserFromManageOrganization(testdata.Fullname);

        await LoginPage.logout("Admin");
    });

    it("Signup As Manager and check manager approval flow and delete manager functionality as Admin", async () => {
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
        console.log("--- START MANAGER APPROVAL ---");
        await managePage.approveManager(testdata.Fullname);
        console.log("--- END MANAGER APPROVAL ---");
        
        // Navigate to Manage Organization and delete manager
        await managePage.DeleteManagerFromManageOrganization(testdata.Fullname);

        await LoginPage.logout("Admin");
    });

    it("Signup As User and check user approval flow and delete User functionality as Admin", async () => {
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
        console.log("--- START MULTI-USER APPROVAL ---");
        // This will Approve ALL users matching "Test" one by one
        await managePage.approveUsersStartingWithPrefix("Test", false);
        // Finally Approve the specific user we just created
        await managePage.approveUsersStartingWithPrefix(testdata.Fullname, true);
        console.log("--- END MULTI-USER APPROVAL ---");
        // Navigate to Manage Organization and verify/delete the approved user
        await managePage.DeleteUserFromManageOrganization(testdata.Fullname);
        await LoginPage.logout("Admin");
    });
    it("Signup As User and check user rejection flow as Manager", async () => {
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
        
        await LoginPage.login_Manager(
            testdata.manager_username,
            testdata.Manager_password,
        );
        
        await managePage.clickManageApprovalsAsManager();

        console.log("--- START MULTI-USER REJECTION (MANAGER) ---");
        // This will reject users using Manager-view locators
        await managePage.rejectUsersAsManagerStartingWithPrefix("Test", false);
        await managePage.rejectUsersAsManagerStartingWithPrefix(testdata.Fullname, true);
        console.log("--- END MULTI-USER REJECTION (MANAGER) ---");

        await LoginPage.logout("Manager");
    });

    it("Signup As User and check user approval flow as Manager", async () => {
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
        
        await LoginPage.login_Manager(
            testdata.manager_username,
            testdata.Manager_password,
        );
        
        await managePage.clickManageApprovalsAsManager();

        console.log("--- START MULTI-USER APPROVAL (MANAGER) ---");
        await managePage.ApproveUsersAsManagerStartingWithPrefix("Test", false);
        await managePage.ApproveUsersAsManagerStartingWithPrefix(testdata.Fullname, true);
        console.log("--- END MULTI-USER APPROVAL (MANAGER) ---");
        await managePage.DeleteUserFromManageOrganization(testdata.Fullname);

        await LoginPage.logout("Manager");
    });
    

});
