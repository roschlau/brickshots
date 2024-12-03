/* eslint-disable @typescript-eslint/no-unsafe-call  */
/* eslint-disable @typescript-eslint/no-unsafe-member-access  */
import {describe, expect, it} from 'bun:test'
import {nextShotAutoNumber, getSceneNumber} from './codes.ts'

describe('sceneNumber(element, index)', () => {
  it('should return (index+1) if no frozen code is set', () => {
    expect(getSceneNumber({lockedNumber: null}, 0))
      .toBe(1)
    expect(getSceneNumber({lockedNumber: null}, 1))
      .toBe(2)
    expect(getSceneNumber({lockedNumber: null}, 2483))
      .toBe(2484)
  })
  it('should let lockedCode override the index', () => {
    expect(getSceneNumber({lockedNumber: 3}, 0))
      .toBe(3)
    expect(getSceneNumber({lockedNumber: 123}, 1))
      .toBe(123)
    expect(getSceneNumber({lockedNumber: 3}, 2483))
      .toBe(3)
  })
})

describe('nextShotAutoNumber(previous, allLocked)', () => {
  it('should start with 10', () => {
    expect(nextShotAutoNumber(0, []))
      .toBe(10)
  })
  it('should return the next available code in steps of ten', () => {
    expect(nextShotAutoNumber(10, []))
      .toBe(20)
    expect(nextShotAutoNumber(20, []))
      .toBe(30)
    expect(nextShotAutoNumber(24830, []))
      .toBe(24840)
  })
  it('should jump to the next multiple of ten after non-multiples of ten', () => {
    expect(nextShotAutoNumber(11, []))
      .toBe(20)
    expect(nextShotAutoNumber(29, []))
      .toBe(30)
  })
  it('should ignore past locked codes', () => {
    expect(nextShotAutoNumber(30, [20]))
      .toBe(40)
  })
  it('should ignore future locked codes if >=10 steps away', () => {
    expect(nextShotAutoNumber(10, [30]))
      .toBe(20)
  })
  it('should place in the middle (floored) if next multiple of ten is already locked', () => {
    expect(nextShotAutoNumber(10, [20, 30]))
      .toBe(15)
    expect(nextShotAutoNumber(10, [19]))
      .toBe(14)
    expect(nextShotAutoNumber(10, [12]))
      .toBe(11)
    expect(nextShotAutoNumber(10, [13]))
      .toBe(11)
  })
  it('should jump ahead if `previous` directly precedes a locked number', () => {
    expect(nextShotAutoNumber(10, [11]))
      .toBe(20)
    expect(nextShotAutoNumber(10, [11, 20]))
      .toBe(15)
  })
})
