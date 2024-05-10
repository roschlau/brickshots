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
  status: ShotStatus
  lockedNumber: number | null
  description: string
  location: string | null
  notes: string
  animated: boolean
}

export type ShotStatus =
  | 'unsure'
  | 'default'
  | 'wip'
  | 'animated'

export function nextStatus(current: ShotStatus): ShotStatus {
  switch (current) {
    case 'unsure':
      return 'default'
    case 'default':
      return 'wip'
    case 'wip':
      return 'animated'
    case 'animated':
      return 'animated'
  }
}

export function statusIconCode(status: ShotStatus): string {
  switch (status) {
    case 'unsure':
      return 'help_center'
    case 'default':
      return 'check_box_outline_blank'
    case 'wip':
      return 'filter_tilt_shift'
    case 'animated':
      return 'check_box'
  }
}

export function statusTooltip(status: ShotStatus): string {
  switch (status) {
    case 'unsure':
      return 'Click to unmark as Unsure'
    case 'default':
      return 'Click to mark as WIP<br>Right-click to mark as Unsure'
    case 'wip':
      return 'Click to mark as Animated'
    case 'animated':
      return 'Right-click to unmark as Animated'
  }
}

export function newShot(data?: Partial<ShotData>): ShotData {
  return {
    status: 'default',
    lockedNumber: null,
    description: '',
    location: null,
    notes: '',
    animated: false,
    ...data,
  }
}
