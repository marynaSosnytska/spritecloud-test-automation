export const TAX_RATE = 0.08

const PRICE = /\$(\d+)\.(\d{2})/

export function toCents(priceText: string): number {
  const match = PRICE.exec(priceText)
  if (!match) throw new Error(`No price found in "${priceText}"`)
  return Number(match[1]) * 100 + Number(match[2])
}

export function calculateExpectedTotals(
  itemPricesCents: number[],
  taxRate: number,
): { itemTotal: number; tax: number; total: number } {
  const itemTotal = itemPricesCents.reduce((sum, price) => sum + price, 0)
  const tax = Math.round(itemTotal * taxRate)
  const total = itemTotal + tax
  return { itemTotal, tax, total }
}
