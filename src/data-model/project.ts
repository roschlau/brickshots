import {SceneData} from './scene.ts'

export interface ProjectData {
  scenes: SceneData[]
}

export function newProject(): ProjectData {
  return {
    scenes: [],
  }
}
