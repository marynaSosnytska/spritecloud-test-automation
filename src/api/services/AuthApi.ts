import type { UserCredentials } from '../../test-data/users'
import type { ApiClient, ApiResponse } from '../ApiClient'

export class AuthApi {
  constructor(private readonly client: ApiClient) {}

  login(credentials: UserCredentials): Promise<ApiResponse> {
    return this.client.post('/auth/login', credentials)
  }

  me(accessToken?: string): Promise<ApiResponse> {
    return this.client.get(
      '/auth/me',
      accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    )
  }
}
