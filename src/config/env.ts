import { config } from 'dotenv'
import { z } from 'zod'

config({ quiet: true })

const schema = z.object({
  UI_BASE_URL: z.url().default('https://www.saucedemo.com'),
  API_BASE_URL: z.url().default('https://dummyjson.com'),
  SAUCE_PASSWORD: z.string().min(1),
  DUMMYJSON_USERNAME: z.string().min(1),
  DUMMYJSON_PASSWORD: z.string().min(1),
})

const result = schema.safeParse(process.env)

if (!result.success) {
  const lines = result.error.issues.map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
  throw new Error(`Invalid environment variables:\n${lines.join('\n')}`)
}

export const env = result.data
