import LoginPage from "../pageobjects/login.page.js";
import { getTestData } from "../utils/dynamicTestData.js";
import SignupPage from "../pageobjects/signup.page.js";

describe("Verify the sign-up Page", () => {
  it("Signup As manager and check inline error message if any filed is missing", async () => {
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
  });
});
