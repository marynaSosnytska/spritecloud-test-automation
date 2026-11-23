export function byNameDesc(a: string, b: string): number {
  return b.localeCompare(a, 'en')
}
