import { expect, test } from '../../src/fixtures'
import type { LineItem } from '../../src/pages/CheckoutOverviewPage'
import { ProductName } from '../../src/test-data/products'
import { Tag } from '../../src/test-data/tags'
import { calculateExpectedTotals, TAX_RATE } from '../../src/utils/price'

test(
  'user can buy two products and is charged the correct total',
  { tag: [Tag.UI, Tag.Smoke] },
  async ({
    loggedInInventory: inventory,
    cartPage,
    checkoutInfoPage,
    checkoutOverviewPage,
    checkoutCompletePage,
    customer,
  }) => {
    const products = [ProductName.Backpack, ProductName.BikeLight]
    const addedItems: LineItem[] = []

    for (const name of products) {
      await test.step(`add "${name}" product to cart`, async () => {
        const item = inventory.item(name)
        addedItems.push({ name, priceCents: await item.price() })
        await item.addToCart()
      })
    }

    await test.step('cart badge counts both items', async () => {
      await expect(inventory.header.cartBadge, 'badge should count both products').toHaveText(
        String(products.length),
      )
    })

    await inventory.header.openCart()

    await test.step('cart holds exactly the chosen products', async () => {
      await expect(cartPage.itemNames, 'cart should list the chosen products').toHaveText(products)
    })

    await cartPage.checkout()
    await checkoutInfoPage.fillCustomer(customer)
    await checkoutInfoPage.continue()

    await test.step('overview lists the chosen products at catalogue prices', async () => {
      expect(
        await checkoutOverviewPage.lineItems(),
        'overview should show the chosen products at their catalogue prices',
      ).toEqual(addedItems)
    })

    await test.step('final price = item total + tax, matching catalogue prices', async () => {
      const expected = calculateExpectedTotals(
        addedItems.map((item) => item.priceCents),
        TAX_RATE,
      )
      expect(await checkoutOverviewPage.itemTotal(), 'item total should match catalogue').toBe(
        expected.itemTotal,
      )
      expect(await checkoutOverviewPage.tax(), 'tax should be 8% of the item total').toBe(
        expected.tax,
      )
      expect(await checkoutOverviewPage.total(), 'total should be item total plus tax').toBe(
        expected.total,
      )
    })

    await checkoutOverviewPage.finish()

    await test.step('order is confirmed and cart is emptied', async () => {
      await expect(
        checkoutCompletePage.confirmationHeader,
        'order confirmation should be shown',
      ).toBeVisible()
      await expect(inventory.header.cartBadge, 'cart should be empty after the order').toHaveCount(
        0,
      )
    })
  },
)
