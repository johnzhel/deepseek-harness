import { describe, expect, it } from 'vitest'

import { parseQuickOptions } from '../src/client/chat/quick-options'

describe('parseQuickOptions', () => {
  it('strips the <options> block and parses numbered options', () => {
    const { clean, options } = parseQuickOptions(
      'text before\n<options>\n1. 继续 i2c-tools\n2. 收尾\n</options>\ntext after',
    )
    expect(options).toEqual(['继续 i2c-tools', '收尾'])
    expect(clean).toContain('text before')
    expect(clean).toContain('text after')
    expect(clean).not.toContain('<options>')
  })

  it('returns the whole text and no options when there is no block', () => {
    const { clean, options } = parseQuickOptions('plain text')
    expect(clean).toBe('plain text')
    expect(options).toEqual([])
  })

  it('strips several numbering styles (1. / 1) / 1、)', () => {
    const { options } = parseQuickOptions('<options>\n1. a\n2) b\n3、c\n</options>')
    expect(options).toEqual(['a', 'b', 'c'])
  })

  it('ignores blank lines inside the block', () => {
    const { options } = parseQuickOptions('<options>\n\n1. only\n\n</options>')
    expect(options).toEqual(['only'])
  })
})
