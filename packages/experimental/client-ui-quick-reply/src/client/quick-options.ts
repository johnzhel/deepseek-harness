/** Parse a fenced ```` ```options ```` block out of an assistant message. */

export interface QuickOptionsResult {
  /** The option strings, with a leading `1. ` / `1) ` / `1、` number stripped. */
  options: string[]
}

/**
 * Extract the options from a fenced ```` ```options ```` block. Each non-empty
 * line inside the block becomes one option. When there is no block, `options`
 * is empty.
 */
export function parseQuickOptions(text: string): QuickOptionsResult {
  const match = /```options\s*\n([\s\S]*?)\n?```/u.exec(text)
  if (match === null) return { options: [] }
  const options = (match[1] ?? '')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^\d+[.)、]\s*/u, '').trim())
    .filter(line => line.length > 0)
  return { options }
}
