export function loadProject(): ProjectData {
  const existing = localStorage.getItem('project')
  if (existing) {
    return JSON.parse(existing) as ProjectData
  }
  return newProject()
}

export interface ProjectData {
  scenes: SceneData[]
}

export function newProject(): ProjectData {
  return {
    scenes: [],
  }
}

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

export interface ShotData {
  lockedNumber: number | null
  description: string
  location: string | null
  notes: string
  animated: boolean
}

export function newShot(data?: Partial<ShotData>): ShotData {
  return {
    lockedNumber: null,
    description: '',
    location: null,
    notes: '',
    animated: false,
    ...data,
  }
}
