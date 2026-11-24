import type { Locator, Page } from '@playwright/test'
import { step } from '../../framework/step'

export class HeaderComponent {
  readonly cartBadge: Locator
  private readonly cartLink: Locator

  constructor(page: Page) {
    this.cartBadge = page.getByTestId('shopping-cart-badge')
    this.cartLink = page.getByRole('button', { name: /^Cart/ })
  }

  @step('Open the cart')
  async openCart(): Promise<void> {
    await this.cartLink.click()
  }
}
