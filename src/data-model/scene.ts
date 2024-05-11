import {ShotData} from './shot.ts'

export interface SceneData {
  lockedNumber: number | null
  description: string
  shots: ShotData[]
}

export function newScene(): SceneData {
  return {
    lockedNumber: null,
    description: '',
    shots: [],
  }
}
