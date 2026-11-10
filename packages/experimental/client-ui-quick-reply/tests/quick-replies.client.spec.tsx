// @vitest-environment jsdom
import { cleanup, fireEvent, render } from '@testing-library/react'
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

function renderWith(text: string, inputActions?: Record<string, unknown>) {
  const useChat = vi.fn((selector: (s: unknown) => unknown) => selector(snapshotWith(text)))
  return render(<QuickReplies turn={{ turn: 0 } as never} useChat={useChat as never} inputActions={inputActions as never} />)
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

it('inserts the option (insertText) without wiping the draft', () => {
  const captureInsertion = vi.fn(() => ({ start: 0, end: 0 }))
  const insertText = vi.fn(() => true)
  const view = renderWith('```options\n1. 继续\n```', { captureInsertion, insertText })
  fireEvent.click(view.getByRole('button', { name: '继续' }))
  expect(captureInsertion).toHaveBeenCalled()
  expect(insertText).toHaveBeenCalledWith('继续', expect.anything())
})
