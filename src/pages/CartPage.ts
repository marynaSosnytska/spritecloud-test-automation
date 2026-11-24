import type { Locator, Page } from '@playwright/test'
import { step } from '../framework/step'
import { BasePage } from './BasePage'

export class CartPage extends BasePage {
  readonly path = '/cart.html'

  readonly itemNames: Locator
  private readonly checkoutButton: Locator

  constructor(page: Page) {
    super(page)
    this.itemNames = page.getByTestId('inventory-item-name')
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' })
  }

  @step('Go to checkout')
  async checkout(): Promise<void> {
    await this.checkoutButton.click()
  }
}
