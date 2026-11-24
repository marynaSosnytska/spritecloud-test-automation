import type { CartProductRequest } from '../../test-data/carts'
import type { ApiClient, ApiResponse } from '../ApiClient'

export class CartsApi {
  constructor(private readonly client: ApiClient) {}

  add(userId: number, items: CartProductRequest[]): Promise<ApiResponse> {
    return this.client.post('/carts/add', { userId, products: items })
  }
}
