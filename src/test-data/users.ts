import { faker } from '@faker-js/faker'
import { env } from '../config/env'
import { LoginError } from './messages'

export enum SauceUsername {
  Standard = 'standard_user',
  LockedOut = 'locked_out_user',
}

export type SauceUser = { username: string; password: string }

const WRONG_PASSWORD = faker.internet.password()

export const users: Record<'standard' | 'lockedOut' | 'invalidPassword', SauceUser> = {
  standard: { username: SauceUsername.Standard, password: env.SAUCE_PASSWORD },
  lockedOut: { username: SauceUsername.LockedOut, password: env.SAUCE_PASSWORD },
  invalidPassword: { username: SauceUsername.Standard, password: WRONG_PASSWORD },
}

export const failedLoginCases: { title: string; user: SauceUser; expectedError: LoginError }[] = [
  {
    title: 'wrong password is rejected',
    user: users.invalidPassword,
    expectedError: LoginError.InvalidCredentials,
  },
  {
    title: 'locked-out user is rejected',
    user: users.lockedOut,
    expectedError: LoginError.LockedOut,
  },
]
