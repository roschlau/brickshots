import {Project} from './model.ts'

export function loadProject(): Project {
  return new Project({
    name: 'Dummy Project',
    scenes: [
      {
        frozenCode: null,
        name: 'Scene 1',
        shots: [
          {
            frozenCode: null,
            description: 'Shot 1',
            notes: 'Some Notes',
            animated: true,
            location: 'Int. Garden',
          },
          {
            frozenCode: null,
            description: 'Shot 2',
            notes: '',
            animated: false,
            location: 'Ext. House',
          },
        ],
      },
      {
        frozenCode: null,
        name: 'Scene 2',
        shots: [
          {
            frozenCode: 2,
            description: 'Shot 1',
            notes: 'Some Notes',
            animated: true,
            location: 'Int. Garden',
          },
          {
            frozenCode: null,
            description: 'Shot 2',
            notes: '',
            animated: false,
            location: 'Ext. House',
          },
        ],
      },
    ],
  })
}

export interface ProjectData {
  name: string
  scenes: SceneData[]
}

export interface SceneData {
  frozenCode: number | null
  name: string
  shots: ShotData[]
}

export interface ShotData {
  frozenCode: number | null
  description: string
  location: string | null
  notes: string
  animated: boolean
}
