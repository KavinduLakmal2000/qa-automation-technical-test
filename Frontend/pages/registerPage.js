const { expect } = require('@playwright/test');
const selectors = require('../selectors/register.selectors');
const data = require('../config/data');

class RegisterPage {
  constructor(page) {
    this.page = page;
    this.selectors = selectors;
    this.urls = data.urls;
  }

  async goto() {
    await this.page.goto(this.urls.register);
  }

  async register({ firstName, email, password, confirmPassword }) {
    if (firstName) await this.page.fill(this.selectors.firstNameInput, firstName);
    if (email) await this.page.fill(this.selectors.emailInput, email);
    if (password) await this.page.fill(this.selectors.passwordInput, password);
    if (confirmPassword) await this.page.fill(this.selectors.confirmPasswordInput, confirmPassword);

   await this.page.click(this.selectors.registerButton)
  }

  async expectRedirectToLogin() {
    await this.page.waitForURL(this.urls.login, { timeout: 10000 });
    await expect(this.page).toHaveURL(this.urls.login);
  }

 
  async expectErrorMessage(text) {
    const error = this.page.locator(this.selectors.errorMessage);
    await expect(error).toBeVisible();
    await expect(error).toContainText(new RegExp(text, 'i'));
  }
}

module.exports = { RegisterPage };
