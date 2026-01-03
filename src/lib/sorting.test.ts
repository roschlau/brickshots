import { describe, it, expect } from 'bun:test'
import { byOrder } from '@/lib/sorting.ts'

describe('byOrder', () => {
  it(`sorts by explicit order`, () => {
    expect([1, 2, 3].sort(byOrder([3, 2, 1])))
      .toEqual([3, 2, 1])
  })
  it(`ignore elements missing in list to sort`, () => {
    expect([1, 2, 4].sort(byOrder([4, 3, 2, 1])))
      .toEqual([4, 2, 1])
  })
  it(`throws on missing elements in order`, () => {
    expect(() => [1, 2, 4].sort(byOrder([3, 2, 1])))
      .toThrow()
  })
  it(`works with accessor`, () => {
    expect(['1', '22', '333'].sort(byOrder([3, 2, 1], x => x.length)))
      .toEqual(['333', '22', '1'])
  })
})
