import type { Locator } from '@playwright/test'
import { step } from '../../framework/step'

export class InventoryItemComponent {
  private readonly addToCartButton: Locator

  constructor(root: Locator) {
    this.addToCartButton = root.getByRole('button', { name: 'Add to cart' })
  }

  @step()
  async addToCart(): Promise<void> {
    await this.addToCartButton.click()
  }
}
