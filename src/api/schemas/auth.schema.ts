import { z } from 'zod'

export const LoginResponseSchema = z.object({
  accessToken: z.jwt(),
  refreshToken: z.jwt(),
  id: z.number().int(),
  username: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  image: z.url(),
})

const AddressSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
})

// Tolerant reader: only the identity and contact fields a consumer relies on are declared.
export const MeResponseSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  phone: z.string(),
  image: z.url(),
  role: z.string(),
  address: AddressSchema,
})
