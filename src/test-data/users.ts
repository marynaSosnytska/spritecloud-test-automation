import { faker } from '@faker-js/faker'
import { env } from '../config/env'
import { LoginError } from './messages'

export enum SauceUsername {
  Standard = 'standard_user',
  LockedOut = 'locked_out_user',
}

export type UserCredentials = { username: string; password: string }

const WRONG_PASSWORD = faker.internet.password()

export const users: Record<'standard' | 'lockedOut' | 'invalidPassword', UserCredentials> = {
  standard: { username: SauceUsername.Standard, password: env.SAUCE_PASSWORD },
  lockedOut: { username: SauceUsername.LockedOut, password: env.SAUCE_PASSWORD },
  invalidPassword: { username: SauceUsername.Standard, password: WRONG_PASSWORD },
}

export const apiUsers: Record<'valid' | 'invalidPassword', UserCredentials> = {
  valid: { username: env.DUMMYJSON_USERNAME, password: env.DUMMYJSON_PASSWORD },
  invalidPassword: { username: env.DUMMYJSON_USERNAME, password: WRONG_PASSWORD },
}

export const failedLoginCases: {
  title: string
  user: UserCredentials
  expectedError: LoginError
}[] = [
  {
    title: 'user cannot log in with a wrong password',
    user: users.invalidPassword,
    expectedError: LoginError.InvalidCredentials,
  },
  {
    title: 'locked out user cannot log in',
    user: users.lockedOut,
    expectedError: LoginError.LockedOut,
  },
]
