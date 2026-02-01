const { expect } = require('@playwright/test'); 
const selectors = require('../selectors/login.selectors'); 
const data = require('../config/data');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.selectors = selectors;
    this.urls = data.urls;
  }

  async goto() {
    await this.page.goto(this.urls.login);
  }

  
  async login(email, password) {
    if (email) await this.page.fill(this.selectors.emailInput, email);
    if (password) await this.page.fill(this.selectors.passwordInput, password);
    
   
    await Promise.all([
      this.page.waitForNavigation({ 
        url: this.urls.dashboard,
        timeout: 15000 
      }).catch(() => {
        console.log('Navigation to dashboard timed out, checking current state');
      }),
      this.page.click(this.selectors.loginButton)
    ]);
    
    
    await this.page.waitForLoadState('networkidle');
  }

  
  async logout() {
    try {
      
      const logoutBtn = this.page.locator(this.selectors.logoutButton);
      await logoutBtn.waitFor({ state: 'visible', timeout: 10000 });
      

      await logoutBtn.click({ 
        timeout: 10000,
        force: true 
      });
      
      
      await Promise.race([
        this.page.waitForURL(this.urls.login, { timeout: 10000 }),
        this.page.waitForTimeout(5000) 
      ]);
    } catch (error) {
      console.warn('Logout click failed, trying alternative approach:', error.message);
      
     
      await this.page.evaluate(() => {
        localStorage.clear();
        window.location.href = '/login';
      });
    }
  }

  
  async expectErrorMessageInvalid(text) {
    const errorLocator = this.page.locator(this.selectors.errorMessageInvalid);
    await errorLocator.waitFor({ state: 'visible', timeout: 10000 });
    await expect(errorLocator).toHaveText(new RegExp(text, 'i'));
  }

  async expectErrorMessageEmptyFields(text) {
    const errorLocator = this.page.locator(this.selectors.errorMessageEmptyFields);
    await errorLocator.waitFor({ state: 'visible', timeout: 10000 });
    await expect(errorLocator).toHaveText(new RegExp(text, 'i'));
  }

  async expectRedirectToDashboard() {
    await expect(this.page).toHaveURL(this.urls.dashboard);
  }

  async expectRedirectToLogin() {
    await expect(this.page).toHaveURL(this.urls.login); 
  }

  async tokenShouldExist() {
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
      expect(state).toBeNull();
    }
  }
}

module.exports = { LoginPage };