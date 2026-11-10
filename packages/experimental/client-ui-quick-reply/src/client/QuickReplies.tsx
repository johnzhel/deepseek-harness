import { useMemo } from 'react'

import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import { parseQuickOptions } from './quick-options.ts'
import css from './QuickReplies.module.css'

/** The inject return carries nothing; turn + useChat arrive via the slot runtime props. */
export interface QuickRepliesInjected {}

/** Component props: the turn seat + the session-scope `useChat` standard hook. */
export type QuickRepliesProps = Pick<PropsRuntime<'conversation.chat.turnTail'>, 'turn' | 'useChat'>
  & InjectFace<QuickRepliesInjected>
  & { send?: (option: string) => void }

/** Collect the assistant text for one turn from the chat snapshot. */
function turnText(snapshot: any, turn: number): string {
  const keys: readonly string[] = snapshot?.locations?.getTurn?.(turn) ?? []
  let text = ''
  for (const key of keys) {
    const node = snapshot.locations?.nodes?.[key]
    if (node?.kind === 'assistant-step') {
      text += (node.data?.blocks ?? [])
        .flatMap((b: any) => (b.kind === 'text' ? [b.text] : []))
        .join('')
    }
  }
  return text
}

export function QuickReplies({ turn, useChat, send }: QuickRepliesProps) {
  const text = useChat(snapshot => turnText(snapshot, turn.turn))
  const { options } = useMemo(() => parseQuickOptions(text), [text])
  if (options.length === 0) return null
  return (
    <div className={css.quickOptions} role="group" aria-label="Quick replies">
      {options.map((opt, i) => (
        <button
          key={`${i}-${opt}`}
          type="button"
          className={css.quickOption}
          title={opt}
          onClick={() => {
            if (send) send(opt)
            else void navigator.clipboard?.writeText(opt)
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
