/**
 * End-to-end tests for authentication flow
 * These tests verify the complete auth flow across multiple user accounts
 */

import { test, expect } from '@playwright/test';

// Test user credentials
const testUsers = [
  {
    email: 'test1@example.com',
    password: 'Password123!',
  },
  {
    email: 'test2@example.com',
    password: 'Password123!',
  }
];

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should redirect unauthenticated users to auth page', async ({ page }) => {
    // Start on home page (should redirect to auth)
    await expect(page).toHaveURL(/.*\/auth/);
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
  });

  test('should allow user signup and signin', async ({ page }) => {
    const user = testUsers[0];

    // Click on sign up link
    await page.locator('button:has-text("Don\'t have an account? Sign up")').click();

    // Fill in signup form
    await page.locator('input#email-address').fill(user.email);
    await page.locator('input#password').fill(user.password);
    await page.locator('input#confirm-password').fill(user.password);

    // Submit signup
    await page.locator('button:has-text("Sign up")').click();

    // Should redirect to callback page
    await expect(page).toHaveURL(/.*\/auth\/callback/);
    await expect(page.locator('text=Authentication successful')).toBeVisible();

    // Should eventually redirect to dashboard
    await page.waitForURL('/**/dashboard');
    await expect(page.locator('text=Welcome,')).toBeVisible();
  });

  test('should allow user signin with existing account', async ({ page }) => {
    const user = testUsers[0];

    // Fill in signin form
    await page.locator('input#email-address').fill(user.email);
    await page.locator('input#password').fill(user.password);

    // Submit signin
    await page.locator('button:has-text("Sign in")').click();

    // Should redirect to dashboard
    await page.waitForURL('/**/dashboard');
    await expect(page.locator('text=Welcome,')).toBeVisible();
  });

  test('should allow user signout', async ({ page }) => {
    // First sign in (using first user)
    const user = testUsers[0];
    await page.locator('input#email-address').fill(user.email);
    await page.locator('input#password').fill(user.password);
    await page.locator('button:has-text("Sign in")').click();

    // Wait for dashboard
    await page.waitForURL('/**/dashboard');
    await expect(page.locator('text=Welcome,')).toBeVisible();

    // Click signout button
    await page.locator('button:has-text("Sign out")').click();

    // Should redirect to auth page
    await expect(page).toHaveURL(/.*\/auth/);
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
  });
});

test.describe('Task Management Flow', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // Ensure clean state

  test.beforeEach(async ({ page }) => {
    // Create and sign in a test user
    const user = testUsers[0];

    // Navigate to auth page
    await page.goto('/auth');

    // Sign up the user
    await page.locator('button:has-text("Don\'t have an account? Sign up")').click();
    await page.locator('input#email-address').fill(user.email);
    await page.locator('input#password').fill(user.password);
    await page.locator('input#confirm-password').fill(user.password);
    await page.locator('button:has-text("Sign up")').click();

    // Wait for redirect to dashboard
    await page.waitForURL('/**/dashboard');
    await expect(page.locator('text=Welcome,')).toBeVisible();
  });

  test('should allow user to create, update, and delete tasks', async ({ page }) => {
    // Create a new task
    await page.locator('input[placeholder="What needs to be done?"]').fill('Test task');
    await page.locator('button:has-text("Add Task")').click();

    // Verify task appears in list
    await expect(page.locator('text=Test task')).toBeVisible();

    // Mark task as complete
    await page.locator('input[type="checkbox"]').first().click();
    await expect(page.locator('text=Test task').first()).toHaveClass(/line-through/);

    // Delete the task
    await page.locator('button:has-text("Delete")').first().click();

    // Verify task is removed
    await expect(page.locator('text=Test task')).not.toBeVisible();
  });

  test('should persist tasks across page reloads', async ({ page }) => {
    // Create a task
    await page.locator('input[placeholder="What needs to be done?"]').fill('Persistent task');
    await page.locator('button:has-text("Add Task")').click();

    // Reload the page
    await page.reload();

    // Wait for dashboard to load
    await page.waitForURL('/**/dashboard');
    await expect(page.locator('text=Welcome,')).toBeVisible();

    // Verify task still exists
    await expect(page.locator('text=Persistent task')).toBeVisible();
  });
});

test.describe('Multi-User Isolation', () => {
  test('should prevent users from seeing each other\'s tasks', async ({ browser }) => {
    // Create two separate browser contexts for different users
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    try {
      // Sign in as User 1 and create tasks
      await page1.goto('/auth');
      await page1.locator('button:has-text("Don\'t have an account? Sign up")').click();

      await page1.locator('input#email-address').fill(testUsers[0].email);
      await page1.locator('input#password').fill(testUsers[0].password);
      await page1.locator('input#confirm-password').fill(testUsers[0].password);
      await page1.locator('button:has-text("Sign up")').click();

      await page1.waitForURL('/**/dashboard');
      await expect(page1.locator('text=Welcome,')).toBeVisible();

      // Create a task as User 1
      await page1.locator('input[placeholder="What needs to be done?"]').fill('User 1 task');
      await page1.locator('button:has-text("Add Task")').click();
      await expect(page1.locator('text=User 1 task')).toBeVisible();

      // Sign in as User 2
      await page2.goto('/auth');
      await page2.locator('button:has-text("Don\'t have an account? Sign up")').click();

      await page2.locator('input#email-address').fill(testUsers[1].email);
      await page2.locator('input#password').fill(testUsers[1].password);
      await page2.locator('input#confirm-password').fill(testUsers[1].password);
      await page2.locator('button:has-text("Sign up")').click();

      await page2.waitForURL('/**/dashboard');
      await expect(page2.locator('text=Welcome,')).toBeVisible();

      // Create a task as User 2
      await page2.locator('input[placeholder="What needs to be done?"]').fill('User 2 task');
      await page2.locator('button:has-text("Add Task")').click();
      await expect(page2.locator('text=User 2 task')).toBeVisible();

      // Verify User 2 cannot see User 1's task
      await expect(page2.locator('text=User 1 task')).not.toBeVisible();

      // Verify User 1 still sees their task
      await page1.bringToFront();
      await expect(page1.locator('text=User 1 task')).toBeVisible();

      // Verify User 1 cannot see User 2's task
      await expect(page1.locator('text=User 2 task')).not.toBeVisible();
    } finally {
      await context1.close();
      await context2.close();
    }
  });
});