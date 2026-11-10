/** Parse an `<options>` quick-reply block out of an assistant message. */

export interface QuickOptionsResult {
  /** The message with the `<options>` block removed. */
  clean: string
  /** The option strings, with a leading `1. ` / `1) ` / `1、` number stripped. */
  options: string[]
}

/**
 * Split an `<options>` block out of the text. Each non-empty line inside the
 * block becomes one option; the block itself is removed from the returned
 * `clean` text. When there is no `<options>` block, `clean` is the whole text
 * and `options` is empty.
 */
export function parseQuickOptions(text: string): QuickOptionsResult {
  const match = /<options>([\s\S]*?)<\/options>/u.exec(text)
  if (match === null || match.index === undefined) return { clean: text, options: [] }
  const options = (match[1] ?? '')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => line.replace(/^\d+[.)、]\s*/u, '').trim())
    .filter(line => line.length > 0)
  const clean = text.slice(0, match.index) + text.slice(match.index + match[0].length)
  return { clean, options }
}
