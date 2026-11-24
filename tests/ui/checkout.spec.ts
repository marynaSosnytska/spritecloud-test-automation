import { expect, test } from '../../src/fixtures'
import type { LineItem } from '../../src/pages/CheckoutOverviewPage'
import { ProductName } from '../../src/test-data/products'
import { Tag } from '../../src/test-data/tags'
import { calculateExpectedTotals, TAX_RATE } from '../../src/utils/price'

test(
  'user buys two products and pays the right total',
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
      await test.step(`add "${name}" to the cart`, async () => {
        const item = inventory.item(name)
        addedItems.push({ name, priceCents: await item.price() })
        await item.addToCart()
      })
    }

    await test.step('cart badge shows two items', async () => {
      await expect(
        inventory.header.cartBadge,
        'cart badge should show how many products were added',
      ).toHaveText(String(products.length))
    })

    await inventory.header.openCart()

    await test.step('cart contains only the products we added', async () => {
      await expect(cartPage.itemNames, 'cart should contain only the products we added').toHaveText(
        products,
      )
    })

    await cartPage.checkout()
    await checkoutInfoPage.fillCustomer(customer)
    await checkoutInfoPage.continue()

    await test.step('overview shows the same products and prices as the inventory page', async () => {
      expect(
        await checkoutOverviewPage.lineItems(),
        'products and prices should be the same as on the inventory page',
      ).toEqual(addedItems)
    })

    await test.step('total adds up: product prices plus tax', async () => {
      const expected = calculateExpectedTotals(
        addedItems.map((item) => item.priceCents),
        TAX_RATE,
      )
      expect(
        await checkoutOverviewPage.itemTotal(),
        'item total should be the sum of the product prices',
      ).toBe(expected.itemTotal)
      expect(await checkoutOverviewPage.tax(), 'tax should be 8% of the item total').toBe(
        expected.tax,
      )
      expect(await checkoutOverviewPage.total(), 'total should be the item total plus tax').toBe(
        expected.total,
      )
    })

    await checkoutOverviewPage.finish()

    await test.step('order goes through and the cart is empty again', async () => {
      await expect(
        checkoutCompletePage.confirmationHeader,
        'user should see the order confirmation',
      ).toBeVisible()
      await expect(
        inventory.header.cartBadge,
        'cart badge should be gone after the order',
      ).toHaveCount(0)
    })
  },
)
