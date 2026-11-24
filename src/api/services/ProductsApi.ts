import type { ApiClient, ApiResponse } from '../ApiClient'

export class ProductsApi {
  constructor(private readonly client: ApiClient) {}

  getById(id: number): Promise<ApiResponse> {
    return this.client.get(`/products/${id}`)
  }

  deleteById(id: number): Promise<ApiResponse> {
    return this.client.delete(`/products/${id}`)
  }
}
