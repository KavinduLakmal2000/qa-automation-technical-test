
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const data = require('../config/data');

test.describe('User Login', () => {

  test('Valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(data.credentials.validUser.email, data.credentials.validUser.password);
     // Assert user is redirected to home/dashboard page
    await expect(page).toHaveURL(data.urls.dashboard);
  });

  test('Invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(data.credentials.invalidUser.email, data.credentials.invalidUser.password);

    // Assert URL did not change
    await expect(page).toHaveURL(data.urls.login);
    
    // Assert error message is visible
    await loginPage.expectErrorMessageInvalid('Invalid email or password');
  });

  test('Empty email and password shows error messages', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', ''); // empty fields

    // Assert error message is visible
    await loginPage.expectErrorMessageEmptyFields('All fields are required.');
  });
});
