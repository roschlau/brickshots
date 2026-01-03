import { GenericValidator, v } from 'convex/values'
import { vShotStatus } from '../../convex/schema'

function vMaybe<V extends GenericValidator>(validator: V) {
  return v.optional(v.union(v.null(), validator))
}

const ProjectFileShot = v.object({
  _id: v.optional(v.string()),
  status: vShotStatus,
  lockedNumber: vMaybe(v.number()),
  description: v.string(),
  location: v.string(),
  notes: v.string(),
  animated: v.optional(v.boolean()),
})

export const ProjectFile = v.object({
  _id: v.optional(v.string()),
  name: v.optional(v.string()),
  scenes: v.array(v.object({
    _id: v.optional(v.string()),
    lockedNumber: vMaybe(v.number()),
    description: v.string(),
    shots: v.array(ProjectFileShot)
  }))
})
