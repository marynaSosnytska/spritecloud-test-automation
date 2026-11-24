import { z } from 'zod'

export function parseContract<T extends z.ZodType>(schema: T, body: unknown): z.infer<T> {
  const result = schema.safeParse(body)
  if (!result.success)
    throw new Error(`Response breaks the contract:\n${z.prettifyError(result.error)}`)
  return result.data
}
