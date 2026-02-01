// // pages/loginPage.js
// const { expect } = require('@playwright/test');
// const selectors = require('../selectors/login.selectors'); // path relative to pages/
// const data = require('../config/data'); // path relative to pages/
// class LoginPage {
//   constructor(page) {
//     this.page = page;
//     this.selectors = selectors;
//     this.urls = data.urls;
//   }

//   async goto() {
//     await this.page.goto(this.urls.login);
//   }

//   async login(email, password) {
//     if (email) await this.page.fill(this.selectors.emailInput, email);
//     if (password) await this.page.fill(this.selectors.passwordInput, password);
//     await this.page.click(this.selectors.loginButton);
//   }
//   async logout() {
//   await this.page.click(this.selectors.logoutButton);
//   }
//   async expectErrorMessageInvalid(text) {
//     const errorLocator = this.page.locator(this.selectors.errorMessageInvalid);
//     await expect(errorLocator).toBeVisible();
//     await expect(errorLocator).toHaveText(new RegExp(text, 'i'));
//   }
//    async expectErrorMessageEmptyFields(text) {
//     const errorLocator = this.page.locator(this.selectors.errorMessageEmptyFields);
//     await expect(errorLocator).toBeVisible();
//     await expect(errorLocator).toHaveText(new RegExp(text, 'i'));
//   }
// }

// module.exports = { LoginPage };
const { expect } = require('@playwright/test'); 
const selectors = require('../selectors/login.selectors'); 
const data = require('../config/data');
class LoginPage {
  constructor(page) {
    this.page = page;
    this.selectors = selectors;
    this.urls = data.urls;
  }

  // Navigate to login page
  async goto() {
    await this.page.goto(this.urls.login);
  }
// Perform login
  async login(email, password) {
    if (email) await this.page.fill(this.selectors.emailInput, email);
    if (password) await this.page.fill(this.selectors.passwordInput, password);

    await Promise.all([
      // Wait for either dashboard URL or logout button to appear
      this.page.waitForURL(this.urls.dashboard, { timeout: 10000 }).catch(() => {}),
      this.page.waitForSelector(this.selectors.logoutButton, { timeout: 10000 }).catch(() => {}),
      this.page.click(this.selectors.loginButton)
    ]);
  }
  // // Perform login
  // async login(email, password) {
  //   if (email) await this.page.fill(this.selectors.emailInput, email);
  //   if (password) await this.page.fill(this.selectors.passwordInput, password);
  //   await this.page.click(this.selectors.loginButton);
  // }

  // Perform logout
  async logout() {
    await this.page.click(this.selectors.logoutButton);
  }

  // Expect invalid credentials error
  async expectErrorMessageInvalid(text) {
    const errorLocator = this.page.locator(this.selectors.errorMessageInvalid);
    await errorLocator.waitFor({ state: 'visible', timeout: 10000 });
    await expect(errorLocator).toHaveText(new RegExp(text, 'i'));
  }

  // Expect empty fields error
  async expectErrorMessageEmptyFields(text) {
    const errorLocator = this.page.locator(this.selectors.errorMessageEmptyFields);
    await errorLocator.waitFor({ state: 'visible', timeout: 10000 });
    await expect(errorLocator).toHaveText(new RegExp(text, 'i'));
  }

  // Assert redirect to dashboard after login
  async expectRedirectToDashboard() {
    await expect(this.page).toHaveURL(this.urls.dashboard);
  }

  // Assert redirect to login page
  async expectRedirectToLogin() {
    await expect(this.page).toHaveURL(this.urls.dashboard);
  }
async tokenShouldExist() {
  // UI proof first (best practice)
  await this.page.waitForSelector(this.selectors.logoutButton, { timeout: 10000 });

  const userRaw = await this.page.evaluate(() =>
    localStorage.getItem('user')
  );

  expect(userRaw).not.toBeNull();

  const parsed = JSON.parse(userRaw);

  expect(parsed.state).toBeDefined();
  expect(parsed.state.user).toBeDefined();
  expect(parsed.state.user.authToken).toBeTruthy();
}

async tokenShouldBeCleared() {
  const state = await this.page.evaluate(() => localStorage.getItem('state'));
  if (state) {
    const parsed = JSON.parse(state);
    expect(parsed.user?.authToken).toBeUndefined();
  } else {
    // no state at all is also valid after logout
    expect(state).toBeNull();
  }
}

}

module.exports = { LoginPage };
