import type { Context } from '@deepseek-ai/cordis'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import { QuickReplies, type QuickRepliesInjected } from './QuickReplies.tsx'

export const inject = ['slots']

/**
 * Register the quick-reply chip renderer on the message turn tail.
 * The session scope auto-provides the `useChat` standard hook; the inject
 * forwards the turn seat so the renderer can read that turn's assistant text.
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
