import { useMemo } from 'react'

import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { ChatNode, ChatSnapshot } from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import { parseQuickOptions } from './quick-options.ts'
import css from './QuickReplies.module.css'

/** The inject return carries nothing; turn/useChat/inputActions arrive via the slot runtime. */
export interface QuickRepliesInjected {}

/** Component props: the turn seat + the session-scope standard hook/prop. */
export type QuickRepliesProps = Pick<PropsRuntime<'conversation.chat.turnTail'>, 'turn' | 'useChat' | 'inputActions'>
  & InjectFace<QuickRepliesInjected>

/** Collect the assistant text for one turn from the chat snapshot. */
function turnText(snapshot: ChatSnapshot, turn: number): string {
  const keys = snapshot.locations.getTurn(turn)
  let text = ''
  for (const key of keys) {
    const node = snapshot.nodes.get(key)
    if (node?.kind === 'assistant-step') {
      const step = node as ChatNode<'assistant-step'>
      text += step.data.blocks
        .flatMap((b) => (b.kind === 'text' ? [b.text] : []))
        .join('')
    }
  }
  return text
}

export function QuickReplies({ turn, useChat, inputActions }: QuickRepliesProps) {
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
            // insertText appends at the cursor WITHOUT replacing the existing
            // draft or its reference chips (unlike setDraft, which wipes it).
            const span = inputActions.captureInsertion()
            inputActions.insertText(opt, span)
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
