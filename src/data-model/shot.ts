import {ShotStatus} from './shot-status.ts'

export interface ShotData {
  status: ShotStatus
  lockedNumber: number | null
  description: string
  location: string | null
  notes: string
}
