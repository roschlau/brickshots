import { Doc } from '../../convex/_generated/dataModel'
import { literals } from 'convex-helpers/validators'

export const shotStatusValues = [
  'default',
  'unsure',
  'wip',
  'animated',
] as const

export const vShotStatus = literals(...shotStatusValues)

export type ShotStatus = Doc<'shots'>['status']

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
