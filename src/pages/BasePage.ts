import type { Page } from '@playwright/test'
import { step } from '../framework/step'

export abstract class BasePage {
  abstract get path(): string

  constructor(readonly page: Page) {}

  @step()
  async open(): Promise<void> {
    await this.page.goto(this.path)
  }
}
