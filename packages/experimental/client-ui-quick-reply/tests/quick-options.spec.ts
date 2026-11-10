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

  it('keeps unnumbered lines whole', () => {
    expect(parseQuickOptions('```options\na\n```').options).toEqual(['a'])
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

  it('returns empty on an unclosed fence', () => {
    expect(parseQuickOptions('```options\n1. a').options).toEqual([])
  })

  it('rejects uppercase OPTIONS', () => {
    expect(parseQuickOptions('```OPTIONS\n1. a\n```').options).toEqual([])
  })

  it('rejects a space after the backticks', () => {
    expect(parseQuickOptions('``` options\n1. a\n```').options).toEqual([])
  })

  it('rejects an inline (mid-line) opening fence', () => {
    expect(parseQuickOptions('text ```options\n1. a\n```').options).toEqual([])
  })

  it('parses only the first block when several exist', () => {
    expect(parseQuickOptions('```options\n1. a\n```\n```options\n2. b\n```').options).toEqual(['a'])
  })
})
