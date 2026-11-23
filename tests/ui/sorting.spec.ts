import { expect, test } from '../../src/fixtures'
import { SortOption } from '../../src/test-data/sort-options'
import { Tag } from '../../src/test-data/tags'
import { byNameDesc } from '../../src/utils/sort'

test(
  'products can be sorted Z-A',
  { tag: [Tag.UI, Tag.Smoke] },
  async ({ loggedInInventory: inventory }) => {
    const initialNames = await inventory.getProductNames()
    const expectedNames = [...initialNames].sort(byNameDesc)

    await inventory.sortBy(SortOption.NameDesc)

    await test.step('products are listed in reverse alphabetical order', async () => {
      await expect(inventory.productNames, 'names should be sorted Z-A').toHaveText(expectedNames)
      expect(expectedNames, 'Z-A should be the exact reverse of the default A-Z order').toEqual(
        [...initialNames].reverse(),
      )
      await expect(inventory.activeSortOption, 'sort dropdown should show Z-A').toHaveText(
        SortOption.NameDesc,
      )
    })
  },
)
