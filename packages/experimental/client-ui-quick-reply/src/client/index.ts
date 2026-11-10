/** Browser-side plugin entry: mount the quick-reply chip slot. */
import type { Context } from '@deepseek-ai/cordis'
import { mountQuickReplies } from './mount.ts'

export { inject } from './mount.ts'
export { parseQuickOptions } from './quick-options.ts'
export { QuickReplies } from './QuickReplies.tsx'

export function apply(ctx: Context): void {
  mountQuickReplies(ctx)
}
