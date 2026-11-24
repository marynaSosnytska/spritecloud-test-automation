import type { Locator, Page } from '@playwright/test'
import { step } from '../framework/step'
import type { UserCredentials } from '../test-data/users'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  readonly path = '/'

  readonly errorMessage: Locator
  private readonly usernameInput: Locator
  private readonly passwordInput: Locator
  private readonly loginButton: Locator

  constructor(page: Page) {
    super(page)
    this.errorMessage = page.getByRole('alert')
    this.usernameInput = page.getByPlaceholder('Username')
    this.passwordInput = page.getByPlaceholder('Password')
    this.loginButton = page.getByRole('button', { name: 'Login' })
  }

  @step('Log in as ${0.username}')
  async login(user: UserCredentials): Promise<void> {
    await this.usernameInput.fill(user.username)
    await this.passwordInput.fill(user.password)
    await this.loginButton.click()
  }
}
