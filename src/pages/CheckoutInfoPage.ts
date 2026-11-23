import type { Locator, Page } from '@playwright/test'
import { step } from '../framework/step'
import type { Customer } from '../test-data/customer.factory'
import { BasePage } from './BasePage'

export class CheckoutInfoPage extends BasePage {
  readonly path = '/checkout-step-one.html'

  private readonly firstNameInput: Locator
  private readonly lastNameInput: Locator
  private readonly postalCodeInput: Locator
  private readonly continueButton: Locator

  constructor(page: Page) {
    super(page)
    this.firstNameInput = page.getByPlaceholder('First Name')
    this.lastNameInput = page.getByPlaceholder('Last Name')
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code')
    this.continueButton = page.getByRole('button', { name: 'Continue' })
  }

  @step('Fill in customer information')
  async fillCustomer(customer: Customer): Promise<void> {
    await this.firstNameInput.fill(customer.firstName)
    await this.lastNameInput.fill(customer.lastName)
    await this.postalCodeInput.fill(customer.postalCode)
  }

  @step()
  async continue(): Promise<void> {
    await this.continueButton.click()
  }
}
