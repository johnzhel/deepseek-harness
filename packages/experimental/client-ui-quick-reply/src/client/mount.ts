import type { Context } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { QuickReplies, type QuickRepliesInjected } from './QuickReplies.tsx'

export const inject = ['slots']

/**
 * Register the quick-reply chip renderer on the message turn tail.
 * The session scope auto-provides the `useChat` standard hook and the
 * `inputActions` standard prop (whose `setDraft` fills the composer with the
 * chosen option — the user still presses Enter, the I3 confirmation gate).
 * Wrapped in ctx.effect so the registration is torn down on unload/HMR.
 */
export function mountQuickReplies(ctx: Context): () => void {
  ctx.effect(() => ctx.slots.inject('conversation.chat.turnTail', () => ctx.slots.register({
    name: 'conversation.chat.turnTail',
    id: '@deepseek-ai/dsh-client-ui-quick-reply',
    inject: (_sessionId: SessionId): QuickRepliesInjected => ({}),
  }, QuickReplies)))
  return () => {}
}
