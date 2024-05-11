import {ShotStatus} from './shot-status.ts'

export interface ShotData {
  status: ShotStatus
  lockedNumber: number | null
  description: string
  location: string | null
  notes: string
  animated: boolean
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
