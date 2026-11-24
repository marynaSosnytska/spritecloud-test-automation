import { expect } from '../fixtures'
import { DISCOUNT_ROUNDING_TOLERANCE, type CartProductRequest } from '../test-data/carts'
import type { Cart } from './schemas/cart.schema'

export function assertCartMatchesRequest(
  cart: Cart,
  userId: number,
  items: CartProductRequest[],
): void {
  expect.soft(cart.userId, 'cart should belong to the logged-in user').toBe(userId)

  expect
    .soft(cart.products, 'cart should have the expected number of products')
    .toHaveLength(items.length)

  expect
    .soft(cart.totalProducts, 'cart totalProducts should equal the number of requested items')
    .toBe(items.length)

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  expect
    .soft(cart.totalQuantity, 'cart totalQuantity should equal the sum of the requested quantities')
    .toBe(totalQuantity)

  let calculatedTotal = 0
  for (const item of items) {
    const line = cart.products.find((line) => line.id === item.id)
    expect.soft(line, `cart should contain a line for product ${item.id}`).toBeDefined()
    if (!line) continue

    expect
      .soft(line.quantity, `line for product ${item.id} should have the expected quantity`)
      .toBe(item.quantity)

    const expectedLineTotal = Math.round(line.price * line.quantity * 100) / 100
    expect
      .soft(line.total, `line for product ${item.id} should have the expected total`)
      .toBeCloseTo(expectedLineTotal, 2)

    calculatedTotal += line.total
  }

  expect
    .soft(cart.total, 'cart total should equal the sum of the line totals')
    .toBeCloseTo(calculatedTotal, 2)
  expect
    .soft(cart.discountedTotal, 'cart discountedTotal should be less than or equal to total')
    .toBeLessThanOrEqual(cart.total)

  for (const line of cart.products) {
    const expectedDiscountedPrice = line.total * (1 - line.discountPercentage / 100)
    expect
      .soft(
        Math.abs(line.discountedPrice - expectedDiscountedPrice),
        `discounted price for product ${line.id} should match its discount, give or take rounding`,
      )
      .toBeLessThanOrEqual(DISCOUNT_ROUNDING_TOLERANCE)
  }
}
