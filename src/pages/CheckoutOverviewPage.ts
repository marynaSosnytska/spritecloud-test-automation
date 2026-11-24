import type { Locator, Page } from '@playwright/test'
import { step } from '../framework/step'
import type { ProductName } from '../test-data/products'
import { toCents } from '../utils/price'
import { BasePage } from './BasePage'

export type LineItem = { name: ProductName; priceCents: number }

export class CheckoutOverviewPage extends BasePage {
  readonly path = '/checkout-step-two.html'

  private readonly items: Locator
  private readonly subtotalLabel: Locator
  private readonly taxLabel: Locator
  private readonly totalLabel: Locator
  private readonly finishButton: Locator

  constructor(page: Page) {
    super(page)
    this.items = page.getByTestId('inventory-item')
    this.subtotalLabel = page.getByTestId('subtotal-label')
    this.taxLabel = page.getByTestId('tax-label')
    this.totalLabel = page.getByTestId('total-label')
    this.finishButton = page.getByRole('button', { name: 'Finish' })
  }

  private async waitForSummary(): Promise<void> {
    await this.totalLabel.waitFor()
  }

  async lineItems(): Promise<LineItem[]> {
    await this.waitForSummary()
    const lineItems: LineItem[] = []
    for (const item of await this.items.all()) {
      const name = (await item.getByTestId('inventory-item-name').innerText()) as ProductName
      const price = await item.getByTestId('inventory-item-price').innerText()
      lineItems.push({ name, priceCents: toCents(price) })
    }
    return lineItems
  }

  async itemTotal(): Promise<number> {
    await this.waitForSummary()
    return toCents(await this.subtotalLabel.innerText())
  }

  async tax(): Promise<number> {
    await this.waitForSummary()
    return toCents(await this.taxLabel.innerText())
  }

  async total(): Promise<number> {
    await this.waitForSummary()
    return toCents(await this.totalLabel.innerText())
  }

  @step('Finish the order')
  async finish(): Promise<void> {
    await this.finishButton.click()
  }
}
