export function loadProject(): ProjectData {
  const existing = localStorage.getItem('project')
  if (existing) {
    return JSON.parse(existing) as ProjectData
  }
  return dummyProject()
}

export function dummyProject(): ProjectData {
  return {
    name: 'Dummy Project',
    scenes: [
      {
        lockedNumber: null,
        shots: [
          {
            lockedNumber: null,
            description: 'Shot 1',
            notes: 'Some Notes',
            animated: true,
            location: 'Int. Garden',
          },
          {
            lockedNumber: null,
            description: 'Shot 2',
            notes: '',
            animated: false,
            location: 'Ext. House',
          },
        ],
      },
      {
        lockedNumber: null,
        shots: [
          {
            lockedNumber: null,
            description: 'Shot 1',
            notes: 'More Notes',
            animated: true,
            location: 'Int. Garden',
          },
          {
            lockedNumber: null,
            description: 'Shot 2',
            notes: '',
            animated: false,
            location: 'Ext. House',
          },
        ],
      },
    ],
  }
}

export interface ProjectData {
  name: string
  scenes: SceneData[]
}

export interface SceneData {
  lockedNumber: number | null
  shots: ShotData[]
}

export interface ShotData {
  lockedNumber: number | null
  description: string
  location: string | null
  notes: string
  animated: boolean
}

export function blankShot(): ShotData {
  return {
    lockedNumber: null,
    description: '',
    location: null,
    notes: '',
    animated: false,
  }
}
