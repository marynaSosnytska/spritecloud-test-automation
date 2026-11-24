import type { Locator } from '@playwright/test'
import { step } from '../../framework/step'
import { toCents } from '../../utils/price'

export class InventoryItemComponent {
  private readonly addToCartButton: Locator
  private readonly priceLabel: Locator

  constructor(root: Locator) {
    this.addToCartButton = root.getByRole('button', { name: 'Add to cart' })
    this.priceLabel = root.getByTestId('inventory-item-price')
  }

  @step('Add to cart')
  async addToCart(): Promise<void> {
    await this.addToCartButton.click()
  }

  async price(): Promise<number> {
    return toCents(await this.priceLabel.innerText())
  }
}
