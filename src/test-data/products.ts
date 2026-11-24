export enum ProductName {
  Backpack = 'Sauce Labs Backpack',
  BikeLight = 'Sauce Labs Bike Light',
  BoltTShirt = 'Sauce Labs Bolt T-Shirt',
  FleeceJacket = 'Sauce Labs Fleece Jacket',
  Onesie = 'Sauce Labs Onesie',
  RedTShirt = 'Test.allTheThings() T-Shirt (Red)',
}

export enum ProductId {
  Existing = 1,
  Missing = 99_999,
}

export const ProductLimits = {
  priceFloor: 0,
  rating: { min: 0, max: 5 },
  discountPercentage: { min: 0, max: 100 },
  reviewRating: { min: 1, max: 5 },
}
