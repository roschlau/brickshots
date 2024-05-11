import {SceneData} from './data-model/scene.ts'

export function getSceneNumber(scene: Pick<SceneData, 'lockedNumber'>, index: number): number {
  return scene.lockedNumber ?? index + 1
}

export function shotCode(sceneNumber: number, shotNumber: number): string {
  return `${sceneNumber.toString().padStart(2, '0')}-${shotNumber.toString().padStart(3, '0')}`
}

export function nextShotAutoNumber(previous: number, lockedNumbers: number[]): number {
  const base = Math.floor((previous + 10) / 10) * 10
  const nextLocked = lockedNumbers.sort((a, b) => a - b).find(it => it > previous)
  if (nextLocked === undefined || nextLocked > base) {
    return base
  }
  if (nextLocked === previous + 1) {
    return nextShotAutoNumber(nextLocked, lockedNumbers)
  }
  return previous + Math.floor((nextLocked - previous) / 2)
}
