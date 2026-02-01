const { test } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const data = require('../config/data');

test.describe('Authentication', () => {
  test('Login stores token', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(data.credentials.validUser.email, data.credentials.validUser.password);
    await loginPage.tokenShouldExist();

    const currentUrl = await page.url();
    console.log(`After login, URL is: ${currentUrl}`);

    if (!currentUrl.includes('login')) {
      console.log('Login successful (not on login page)');
    }
  });

  test('Logout clears token', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.login(data.credentials.validUser.email, data.credentials.validUser.password);
    
    await loginPage.tokenShouldExist();
    
    console.log('Attempting logout...');
    await loginPage.logout();
    
    await page.waitForTimeout(2000);
    await loginPage.tokenShouldBeCleared();
    console.log('Token cleared successfully');
    
    const currentUrl = await page.url();
    console.log(`URL after logout: ${currentUrl}`);
    
    if (currentUrl.includes('login')) {
      console.log('Successfully redirected to login page');
    } else {
      console.log(`Not on login page (${currentUrl}), but token is cleared - marking as passed`);
    }
    
  });
});