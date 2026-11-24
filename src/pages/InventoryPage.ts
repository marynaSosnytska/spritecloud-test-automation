import type { Locator, Page } from '@playwright/test'
import { step } from '../framework/step'
import type { ProductName } from '../test-data/products'
import type { SortOption } from '../test-data/sort-options'
import { BasePage } from './BasePage'
import { HeaderComponent } from './components/HeaderComponent'
import { InventoryItemComponent } from './components/InventoryItemComponent'

export class InventoryPage extends BasePage {
  readonly path = '/inventory.html'

  readonly header: HeaderComponent
  readonly productNames: Locator
  readonly activeSortOption: Locator
  private readonly title: Locator
  private readonly items: Locator
  private readonly sortSelect: Locator

  constructor(page: Page) {
    super(page)
    this.header = new HeaderComponent(page)
    this.productNames = page.getByTestId('inventory-item-name')
    this.activeSortOption = page.getByTestId('active-option')
    this.title = page.getByTestId('title')
    this.items = page.getByTestId('inventory-item')
    this.sortSelect = page.getByRole('combobox', { name: 'Sort products' })
  }

  @step('Wait for the page to load')
  async waitForLoaded(): Promise<void> {
    await this.title.waitFor()
  }

  item(name: ProductName): InventoryItemComponent {
    const root = this.items.filter({ has: this.page.getByText(name, { exact: true }) })
    return new InventoryItemComponent(root)
  }

  @step('Sort products by "${0}"')
  async sortBy(option: SortOption): Promise<void> {
    await this.sortSelect.selectOption({ label: option })
  }

  async getProductNames(): Promise<string[]> {
    return this.productNames.allTextContents()
  }
}
