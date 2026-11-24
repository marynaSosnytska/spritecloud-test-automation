import { parseContract } from '../../src/api/contract'
import { ErrorSchema } from '../../src/api/schemas/error.schema'
import { ProductSchema } from '../../src/api/schemas/product.schema'
import { expect, test } from '../../src/fixtures'
import { HttpStatus } from '../../src/test-data/http'
import { productNotFound } from '../../src/test-data/messages'
import { ProductId, ProductLimits } from '../../src/test-data/products'
import { Tag } from '../../src/test-data/tags'

test(
  'product can be fetched by id and its data makes sense',
  { tag: [Tag.API, Tag.Smoke] },
  async ({ productsApi }) => {
    const response = await productsApi.getById(ProductId.Existing)

    await test.step('product is found', () => {
      expect(response.status, 'request for an existing product should succeed').toBe(HttpStatus.OK)
    })

    const product = await test.step('product has the expected fields', () =>
      parseContract(ProductSchema, response.body))

    await test.step('it is the product we asked for', () => {
      expect(product.id, 'product id should be the one we asked for').toBe(ProductId.Existing)
    })

    await test.step('price, rating and discount are realistic', () => {
      expect(product.price, 'price should be above the minimum').toBeGreaterThan(
        ProductLimits.priceFloor,
      )
      expect(product.rating, 'rating should not be too low').toBeGreaterThanOrEqual(
        ProductLimits.rating.min,
      )
      expect(product.rating, 'rating should not be too high').toBeLessThanOrEqual(
        ProductLimits.rating.max,
      )
      expect(product.discountPercentage, 'discount should not be too low').toBeGreaterThanOrEqual(
        ProductLimits.discountPercentage.min,
      )
      expect(product.discountPercentage, 'discount should not be too high').toBeLessThanOrEqual(
        ProductLimits.discountPercentage.max,
      )
    })

    await test.step('all review ratings are within the allowed range', () => {
      for (const review of product.reviews) {
        expect(review.rating, 'review rating should not be too low').toBeGreaterThanOrEqual(
          ProductLimits.reviewRating.min,
        )
        expect(review.rating, 'review rating should not be too high').toBeLessThanOrEqual(
          ProductLimits.reviewRating.max,
        )
      }
    })
  },
)

test(
  'product that does not exist returns 404',
  { tag: [Tag.API, Tag.Negative] },
  async ({ productsApi }) => {
    const response = await productsApi.getById(ProductId.Missing)

    await test.step('response says the product was not found', () => {
      expect(response.status, 'request for a missing product should return 404').toBe(
        HttpStatus.NotFound,
      )
      expect(
        parseContract(ErrorSchema, response.body).message,
        'error should include the id we asked for',
      ).toBe(productNotFound(ProductId.Missing))
    })
  },
)
