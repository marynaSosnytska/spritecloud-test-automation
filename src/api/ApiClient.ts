import type { APIRequestContext, TestInfo } from '@playwright/test'
import { HttpMethod } from '../test-data/http'

export type ApiResponse = { status: number; body: unknown }

const REDACTED = '***'

// The report is published, so secrets never go into attachments (the real request is untouched)
const SECRET_FIELDS = ['password', 'accessToken', 'refreshToken']

function redactBody(body: unknown): unknown {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return body
  return Object.fromEntries(
    Object.entries(body).map(([key, value]) => [
      key,
      SECRET_FIELDS.includes(key) ? REDACTED : value,
    ]),
  )
}

function redactHeaders(headers: Record<string, string> | undefined) {
  return headers && 'Authorization' in headers ? { ...headers, Authorization: REDACTED } : headers
}

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly testInfo: TestInfo,
  ) {}

  get(path: string, headers?: Record<string, string>): Promise<ApiResponse> {
    return this.send(HttpMethod.GET, path, { headers })
  }

  post(path: string, data: object, headers?: Record<string, string>): Promise<ApiResponse> {
    return this.send(HttpMethod.POST, path, { data, headers })
  }

  delete(path: string, headers?: Record<string, string>): Promise<ApiResponse> {
    return this.send(HttpMethod.DELETE, path, { headers })
  }

  private async send(
    method: HttpMethod,
    path: string,
    options: { data?: object; headers?: Record<string, string> },
  ): Promise<ApiResponse> {
    await this.attach(`${method} ${path} request`, {
      headers: redactHeaders(options.headers),
      body: redactBody(options.data),
    })
    const response = await this.request.fetch(path, { method, ...options })
    const text = await response.text()
    let body: unknown = text
    try {
      body = JSON.parse(text)
    } catch {
      // not JSON (for example an HTML error page): keep the text so the report shows it
    }
    await this.attach(`${method} ${path} response`, {
      status: response.status(),
      body: redactBody(body),
    })
    return { status: response.status(), body }
  }

  private attach(name: string, content: object) {
    return this.testInfo.attach(name, {
      body: JSON.stringify(content, null, 2),
      contentType: 'application/json',
    })
  }
}
