export enum LoginError {
  InvalidCredentials = 'Epic sadface: Username and password do not match any user in this service',
  LockedOut = 'Epic sadface: Sorry, this user has been locked out.',
}

export enum ApiError {
  InvalidCredentials = 'Invalid credentials',
}

export const productNotFound = (id: number): string => `Product with id '${id}' not found`
