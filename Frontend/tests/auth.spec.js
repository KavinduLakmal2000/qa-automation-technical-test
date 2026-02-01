const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const data = require('../config/data');

test.describe('Authentication', () => {

  test('Login stores token', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(data.credentials.validUser.email, data.credentials.validUser.password);
    await loginPage.tokenShouldExist();
    await loginPage.expectRedirectToDashboard();
  });

  test('Logout clears token', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(data.credentials.validUser.email, data.credentials.validUser.password);
    await loginPage.logout();
    await loginPage.tokenShouldBeCleared();
    await loginPage.expectRedirectToLogin();
  });



});
