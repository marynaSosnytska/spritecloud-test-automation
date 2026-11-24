import { parseContract } from '../../src/api/contract'
import { LoginResponseSchema, MeResponseSchema } from '../../src/api/schemas/auth.schema'
import { ErrorSchema } from '../../src/api/schemas/error.schema'
import { expect, test } from '../../src/fixtures'
import { HttpStatus } from '../../src/test-data/http'
import { ApiError } from '../../src/test-data/messages'
import { Tag } from '../../src/test-data/tags'
import { apiUsers } from '../../src/test-data/users'

test(
  'user can log in and use the token they get',
  { tag: [Tag.API, Tag.Smoke] },
  async ({ authApi }) => {
    const response = await authApi.login(apiUsers.valid)

    await test.step('login succeeds', () => {
      expect(response.status, 'login with valid credentials should succeed').toBe(HttpStatus.OK)
    })

    const login = await test.step('login response has the expected fields and JWT tokens', () =>
      parseContract(LoginResponseSchema, response.body))

    await test.step('login response is for the right user', () => {
      expect(login.username, 'username should be the one we logged in with').toBe(
        apiUsers.valid.username,
      )
    })

    const meResponse = await authApi.me(login.accessToken)

    await test.step('token opens the user profile', () => {
      expect(meResponse.status, 'profile should be available with this token').toBe(HttpStatus.OK)
    })

    const me = await test.step('profile has the expected fields', () =>
      parseContract(MeResponseSchema, meResponse.body))

    await test.step('profile belongs to the same user', () => {
      expect(me.id, 'profile id should be the same as in the login response').toBe(login.id)
      expect(me.username, 'profile username should be the same as in the login response').toBe(
        login.username,
      )
    })
  },
)

test(
  'user cannot log in with a wrong password',
  { tag: [Tag.API, Tag.Negative] },
  async ({ authApi }) => {
    const response = await authApi.login(apiUsers.invalidPassword)

    await test.step('login fails with an invalid credentials error', () => {
      expect(response.status, 'login with a wrong password should return 400').toBe(
        HttpStatus.BadRequest,
      )
      expect(
        parseContract(ErrorSchema, response.body).message,
        'error should say the credentials are invalid',
      ).toBe(ApiError.InvalidCredentials)
    })
  },
)
