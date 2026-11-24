import { env } from '../../src/config/env'
import { expect, test } from '../../src/fixtures'
import { Tag } from '../../src/test-data/tags'
import { failedLoginCases } from '../../src/test-data/users'

for (const { title, user, expectedError } of failedLoginCases) {
  test(title, { tag: [Tag.UI, Tag.Negative] }, async ({ page, loginPage }) => {
    await loginPage.open()
    await loginPage.login(user)

    await test.step('user stays on the login page and sees the error', async () => {
      await expect(loginPage.errorMessage, 'error should explain why the login failed').toHaveText(
        expectedError,
      )
      await expect(page, 'user should still be on the login page').toHaveURL(env.UI_BASE_URL + '/')
    })
  })
}
