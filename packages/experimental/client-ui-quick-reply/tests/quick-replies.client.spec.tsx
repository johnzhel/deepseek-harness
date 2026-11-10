// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import { QuickReplies } from '../src/client/QuickReplies.tsx'

afterEach(cleanup)

function snapshotWith(text: string) {
  return {
    locations: { getTurn: () => ['k1'] },
    nodes: { get: (key: string) => (key === 'k1'
      ? { kind: 'assistant-step', data: { blocks: [{ kind: 'text', text }] } }
      : undefined) },
  }
}

function renderWith(text: string) {
  const useChat = vi.fn((selector: (s: unknown) => unknown) => selector(snapshotWith(text)))
  return render(<QuickReplies turn={{ turn: 0 } as never} useChat={useChat as never} />)
}

it('renders a chip per option from a fenced options block', () => {
  const view = renderWith('```options\n1. 继续\n2. 收尾\n```')
  expect(view.getByRole('button', { name: '继续' })).toBeTruthy()
  expect(view.getByRole('button', { name: '收尾' })).toBeTruthy()
})

it('renders nothing when the reply has no options block', () => {
  const view = renderWith('plain text')
  expect(view.queryByRole('button')).toBeNull()
})
