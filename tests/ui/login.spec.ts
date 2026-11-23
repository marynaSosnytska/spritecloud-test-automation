import { env } from '../../src/config/env'
import { expect, test } from '../../src/fixtures'
import { Tag } from '../../src/test-data/tags'
import { failedLoginCases } from '../../src/test-data/users'

for (const { title, user, expectedError } of failedLoginCases) {
  test(title, { tag: [Tag.UI, Tag.Negative] }, async ({ page, loginPage }) => {
    await loginPage.open()
    await loginPage.login(user)

    await test.step('user sees why login was rejected', async () => {
      await expect(loginPage.errorMessage, 'login error should be shown').toHaveText(expectedError)
      await expect(page, 'user should stay on login page').toHaveURL(env.UI_BASE_URL + '/')
    })
  })
}
