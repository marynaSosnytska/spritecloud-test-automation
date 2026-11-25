import { faker } from '@faker-js/faker'
import { expect, test as base } from '@playwright/test'
import { ApiClient } from '../api/ApiClient'
import { parseContract } from '../api/contract'
import { LoginResponseSchema } from '../api/schemas/auth.schema'
import { AuthApi } from '../api/services/AuthApi'
import { CartsApi } from '../api/services/CartsApi'
import { ProductsApi } from '../api/services/ProductsApi'
import { CartPage } from '../pages/CartPage'
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage'
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage'
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage'
import { InventoryPage } from '../pages/InventoryPage'
import { LoginPage } from '../pages/LoginPage'
import { buildCustomer, type Customer } from '../test-data/customer.factory'
import { HttpStatus } from '../test-data/http'
import { apiUsers, users } from '../test-data/users'

type AuthSession = { userId: number }

type Fixtures = {
  loginPage: LoginPage
  loggedInInventory: InventoryPage
  cartPage: CartPage
  checkoutInfoPage: CheckoutInfoPage
  checkoutOverviewPage: CheckoutOverviewPage
  checkoutCompletePage: CheckoutCompletePage
  customer: Customer
  authApi: AuthApi
  productsApi: ProductsApi
  cartsApi: CartsApi
  authSession: AuthSession
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
  authApi: async ({ request }, use, testInfo) => {
    await use(new AuthApi(new ApiClient(request, testInfo)))
  },
  productsApi: async ({ request }, use, testInfo) => {
    await use(new ProductsApi(new ApiClient(request, testInfo)))
  },
  cartsApi: async ({ request }, use, testInfo) => {
    await use(new CartsApi(new ApiClient(request, testInfo)))
  },
  authSession: async ({ authApi }, use) => {
    const response = await authApi.login(apiUsers.valid)
    expect(response.status, 'API login for the session should succeed').toBe(HttpStatus.OK)
    const login = parseContract(LoginResponseSchema, response.body)
    await use({ userId: login.id })
  },
})

export { expect }
