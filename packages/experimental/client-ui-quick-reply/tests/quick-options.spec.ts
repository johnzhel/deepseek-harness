import { describe, expect, it } from 'vitest'

import { parseQuickOptions } from '../src/client/quick-options'

describe('parseQuickOptions', () => {
  it('strips the fenced ```options block and parses numbered options', () => {
    const { clean, options } = parseQuickOptions(
      'before\n```options\n1. 继续\n2. 收尾\n```\nafter',
    )
    expect(options).toEqual(['继续', '收尾'])
    expect(clean).toContain('before')
    expect(clean).toContain('after')
    expect(clean).not.toContain('options')
  })

  it('returns the whole text when no block', () => {
    const { clean, options } = parseQuickOptions('plain')
    expect(clean).toBe('plain')
    expect(options).toEqual([])
  })

  it('strips 1. / 1) / 1、 numbering', () => {
    const { options } = parseQuickOptions('```options\n1. a\n2) b\n3、c\n```')
    expect(options).toEqual(['a', 'b', 'c'])
  })

  it('ignores blank lines inside the block', () => {
    const { options } = parseQuickOptions('```options\n\n1. only\n\n```')
    expect(options).toEqual(['only'])
  })
})
