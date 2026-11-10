import { describe, expect, it } from 'vitest'

import { parseQuickOptions } from '../src/client/quick-options'

describe('parseQuickOptions', () => {
  it('parses numbered options from a fenced block', () => {
    expect(parseQuickOptions('```options\n1. 继续\n2. 收尾\n```').options).toEqual(['继续', '收尾'])
  })

  it('returns empty when no block', () => {
    expect(parseQuickOptions('plain').options).toEqual([])
  })

  it('strips 1. / 1) / 1、 numbering', () => {
    expect(parseQuickOptions('```options\n1. a\n2) b\n3、c\n```').options).toEqual(['a', 'b', 'c'])
  })

  it('ignores blank lines', () => {
    expect(parseQuickOptions('```options\n\n1. only\n\n```').options).toEqual(['only'])
  })

  it('handles CRLF line endings', () => {
    expect(parseQuickOptions('```options\r\n1. a\r\n2. b\r\n```').options).toEqual(['a', 'b'])
  })

  it('handles no trailing newline before the close fence', () => {
    expect(parseQuickOptions('```options\n1. a\n2. b```').options).toEqual(['a', 'b'])
  })

  it('handles an empty block', () => {
    expect(parseQuickOptions('```options\n```').options).toEqual([])
  })
})
