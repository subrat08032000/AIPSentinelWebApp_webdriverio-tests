import testdata from "../pageobjects/testdata.json" with { type: "json" };

export const getTestData = () => {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 10000);

  return {
    ...testdata,
    Fullname: `Test User ${randomSuffix}`,
    Designation: `Tester ${randomSuffix}`,
    Phone: `+919${timestamp.toString().slice(-9)}`,
    Email: `auto_${timestamp}@yopmail.com`,
  };
};
