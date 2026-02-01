const { test } = require('@playwright/test');
const { RegisterPage } = require('../pages/registerPage');
const data = require('../config/data');
const { generateRandomEmail } = require('../utils/generateEmail');

test.describe('User Registration', () => {

  test('Valid registration', async ({ page }) => {
    const regPage = new RegisterPage(page);
    await regPage.goto();

    const uniqueEmail = generateRandomEmail('testuser');

    await regPage.register({
      firstName: data.registration.validUser.firstName,
      email: uniqueEmail,
      password: data.registration.validUser.password,
      confirmPassword: data.registration.validUser.confirmPassword
    });
// Assert user is redirected to login page
    await regPage.expectRedirectToLogin();
  });

  test('Missing email', async ({ page }) => {
    const regPage = new RegisterPage(page);
    await regPage.goto();

    await regPage.register(data.registration.missingEmail);
    // Assert error message is visible
    await regPage.expectErrorMessage('All fields are required');
  });

  test('Missing password', async ({ page }) => {
    const regPage = new RegisterPage(page);
    await regPage.goto();

    await regPage.register(data.registration.missingPassword);
    // Assert error message is visible
    await regPage.expectErrorMessage('All fields are required');
  });

  test('Password mismatch', async ({ page }) => {
    const regPage = new RegisterPage(page);
    await regPage.goto();

    await regPage.register(data.registration.passwordMismatch);
    // Assert error message is visible
    await regPage.expectErrorMessage('Passwords do not match');
  });

  test('Invalid email format', async ({ page }) => {
    const regPage = new RegisterPage(page);
    await regPage.goto();

    await regPage.register(data.registration.invalidEmail);
    // Assert error message is visible
    await regPage.expectErrorMessage('Invalid email');
  });

  test('Duplicate email', async ({ page }) => {
    const regPage = new RegisterPage(page);
    await regPage.goto();

    await regPage.register(data.registration.duplicateEmail);
    await regPage.expectErrorMessage('User already exists');
  });
});
