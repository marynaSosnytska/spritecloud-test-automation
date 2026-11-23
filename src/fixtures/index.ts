import { faker } from '@faker-js/faker'
import { test as base } from '@playwright/test'
import { CartPage } from '../pages/CartPage'
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage'
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage'
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage'
import { InventoryPage } from '../pages/InventoryPage'
import { LoginPage } from '../pages/LoginPage'
import { buildCustomer, type Customer } from '../test-data/customer.factory'
import { users } from '../test-data/users'

type Fixtures = {
  loginPage: LoginPage
  loggedInInventory: InventoryPage
  cartPage: CartPage
  checkoutInfoPage: CheckoutInfoPage
  checkoutOverviewPage: CheckoutOverviewPage
  checkoutCompletePage: CheckoutCompletePage
  customer: Customer
}

export const test = base.extend<Fixtures>({
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
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page))
  },
  checkoutInfoPage: async ({ page }, use) => {
    await use(new CheckoutInfoPage(page))
  },
  checkoutOverviewPage: async ({ page }, use) => {
    await use(new CheckoutOverviewPage(page))
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page))
  },
  customer: async ({}, use, testInfo) => {
    const seed = Date.now()
    faker.seed(seed)
    testInfo.annotations.push({ type: 'faker-seed', description: String(seed) })
    await use(buildCustomer())
  },
})

export { expect } from '@playwright/test'
