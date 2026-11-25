import { faker } from '@faker-js/faker'

export type Customer = { firstName: string; lastName: string; postalCode: string }

export function buildCustomer(): Customer {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    postalCode: faker.location.zipCode(),
  }
}
