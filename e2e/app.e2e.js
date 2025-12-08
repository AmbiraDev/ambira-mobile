/* eslint-disable jest/expect-expect */

describe('Ambira app', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true, permissions: { notifications: 'YES' } });
  });

  beforeEach(async () => {
    // Ensure we reset to welcome screen between tests.
    await device.reloadReactNative();
  });

  it('shows welcome and navigates to signup', async () => {
    await expect(element(by.text('Sign up free'))).toBeVisible();
    await element(by.text('Sign up free')).tap();
    await expect(element(by.text('Sign Up With Email'))).toBeVisible();
  });

  it('navigates to login screen', async () => {
    await element(by.text('Sign in')).tap();
    await expect(element(by.text('Sign In'))).toBeVisible();
  });
});
