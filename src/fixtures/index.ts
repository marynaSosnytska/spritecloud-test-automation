import { test as base } from '@playwright/test'
import { InventoryPage } from '../pages/InventoryPage'
import { LoginPage } from '../pages/LoginPage'
import { users } from '../test-data/users'

export const test = base.extend<{ loginPage: LoginPage; loggedInInventory: InventoryPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  loggedInInventory: async ({ page, loginPage }, use) => {
    await loginPage.open()
    await loginPage.login(users.standard)
    const inventoryPage = new InventoryPage(page)
    await inventoryPage.waitForLoaded()
    await use(inventoryPage)
  },
})

export { expect } from '@playwright/test'
