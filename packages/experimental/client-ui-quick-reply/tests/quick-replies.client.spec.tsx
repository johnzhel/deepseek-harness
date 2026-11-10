// @vitest-environment jsdom
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'

import { QuickReplies } from '../src/client/QuickReplies.tsx'

afterEach(cleanup)

function snapshotWith(text: string, turn = 0, keys: string[] = ['k1']) {
  return {
    locations: { getTurn: (t: number) => (t === turn ? keys : []) },
    nodes: { get: (key: string) => (key === 'k1'
      ? { kind: 'assistant-step', data: { blocks: [{ kind: 'text', text }] } }
      : undefined) },
  }
}

function renderWith(text: string, inputActions?: Record<string, unknown>, snapshot?: unknown) {
  const useChat = vi.fn((selector: (s: unknown) => unknown) => selector(snapshot ?? snapshotWith(text)))
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
  expect(insertText).toHaveBeenCalledWith('继续', { start: 0, end: 0 })
})

it('falls back to copy when insertText returns false', () => {
  const captureInsertion = vi.fn(() => ({ start: 0, end: 0 }))
  const insertText = vi.fn(() => false)
  const view = renderWith('```options\n1. 继续\n```', { captureInsertion, insertText })
  fireEvent.click(view.getByRole('button', { name: '继续' }))
  expect(insertText).toHaveBeenCalledWith('继续', { start: 0, end: 0 })
})

it('uses only the closing assistant step, not prior process steps', () => {
  const snapshot = {
    locations: { getTurn: (t: number) => (t === 0 ? ['k1', 'k2'] : []) },
    nodes: { get: (key: string) => (key === 'k1'
      ? { kind: 'assistant-step', data: { blocks: [{ kind: 'text', text: '```options\n1. stale\n```' }] } }
      : key === 'k2'
        ? { kind: 'assistant-step', data: { blocks: [{ kind: 'text', text: '```options\n1. current\n```' }] } }
        : undefined) },
  }
  const view = renderWith('', {}, snapshot)
  expect(view.getByRole('button', { name: 'current' })).toBeTruthy()
  expect(view.queryByRole('button', { name: 'stale' })).toBeNull()
})

it('ignores other turns (no chip from a different turn)', () => {
  const snapshot = {
    locations: { getTurn: (t: number) => (t === 0 ? ['k1'] : ['other']) },
    nodes: { get: (key: string) => (key === 'k1'
      ? { kind: 'assistant-step', data: { blocks: [{ kind: 'text', text: '```options\n1. mine\n```' }] } }
      : key === 'other'
        ? { kind: 'assistant-step', data: { blocks: [{ kind: 'text', text: '```options\n1. otherturn\n```' }] } }
        : undefined) },
  }
  const view = renderWith('', {}, snapshot)
  expect(view.getByRole('button', { name: 'mine' })).toBeTruthy()
  expect(view.queryByRole('button', { name: 'otherturn' })).toBeNull()
})
