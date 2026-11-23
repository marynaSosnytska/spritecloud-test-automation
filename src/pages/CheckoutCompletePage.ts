import type { Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class CheckoutCompletePage extends BasePage {
  readonly path = '/checkout-complete.html'

  readonly confirmationHeader: Locator

  constructor(page: Page) {
    super(page)
    this.confirmationHeader = page.getByRole('heading', { name: 'Thank you for your order!' })
  }
}
