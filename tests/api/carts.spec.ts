import { assertCartMatchesRequest } from '../../src/api/cart-invariants'
import { parseContract } from '../../src/api/contract'
import { CartSchema } from '../../src/api/schemas/cart.schema'
import { expect, test } from '../../src/fixtures'
import { cartProducts } from '../../src/test-data/carts'
import { HttpStatus } from '../../src/test-data/http'
import { Tag } from '../../src/test-data/tags'

test(
  'user can create a cart with 3 products',
  { tag: [Tag.API, Tag.Smoke] },
  async ({ cartsApi, authSession }) => {
    const response = await cartsApi.add(authSession.userId, cartProducts)

    await test.step('cart is created', () => {
      expect(response.status, 'cart creation should return 201').toBe(HttpStatus.Created)
    })

    const cart = await test.step('cart has the expected fields', () =>
      parseContract(CartSchema, response.body))

    await test.step('cart belongs to the logged-in user and matches what we asked for', () => {
      assertCartMatchesRequest(cart, authSession.userId, cartProducts)
    })
  },
)
