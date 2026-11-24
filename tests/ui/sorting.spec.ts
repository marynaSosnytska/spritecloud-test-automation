import { expect, test } from '../../src/fixtures'
import { SortOption } from '../../src/test-data/sort-options'
import { Tag } from '../../src/test-data/tags'
import { byNameDesc } from '../../src/utils/sort'

test(
  'user can sort products by name from Z to A',
  { tag: [Tag.UI, Tag.Smoke] },
  async ({ loggedInInventory: inventory }) => {
    const initialNames = await inventory.getProductNames()
    const expectedNames = [...initialNames].sort(byNameDesc)

    await inventory.sortBy(SortOption.NameDesc)

    await test.step('products are listed from Z to A', async () => {
      await expect(inventory.productNames, 'product names should go from Z to A').toHaveText(
        expectedNames,
      )
      expect(expectedNames, 'Z to A should be the default A to Z list in reverse').toEqual(
        [...initialNames].reverse(),
      )
      await expect(
        inventory.activeSortOption,
        'sort dropdown should show the selected Z to A option',
      ).toHaveText(SortOption.NameDesc)
    })
  },
)
