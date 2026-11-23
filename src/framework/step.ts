import { test } from '@playwright/test'

const PLACEHOLDER = /\$\{(\d+)(?:\.([^}]+))?\}/g

/**
 * Formats a value for display in step names
 */
function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ')
  if (value !== null && typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/**
 * Gets a nested property value from a source object using dot notation
 */
function readPath(source: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (current, key) => (current as Record<string, unknown> | undefined)?.[key],
      source,
    )
}

/**
 * Processes a title and replaces parameter placeholders with actual values
 */
function fillPlaceholders(title: string, args: unknown[]): string {
  return title.replace(PLACEHOLDER, (match, index: string, path?: string) => {
    const i = Number(index)
    if (i >= args.length) return match
    return formatValue(path ? readPath(args[i], path) : args[i])
  })
}

/**
 * Wraps an async method in a boxed test.step titled "[ClassName] <title>".
 * Placeholders `${0}` and `${0.prop}` insert the call's arguments. Without a title, the
 * capitalised method name is used.
 */
export function step(title?: string) {
  return function <This extends object, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
  ) {
    return function (this: This, ...args: Args): Promise<Return> {
      const name = String(context.name)
      const label = title
        ? fillPlaceholders(title, args)
        : name.charAt(0).toUpperCase() + name.slice(1)
      return test.step(`[${this.constructor.name}] ${label}`, () => target.call(this, ...args), {
        box: true,
      })
    }
  }
}
