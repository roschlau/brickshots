import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import { vShotStatus } from '../src/data-model/shot-status'
import { authTables } from '@convex-dev/auth/server'

export default defineSchema({
  ...authTables,
  projects: defineTable({
    name: v.string(),
    owner: v.id('users'),
  }).index('by_owner', ['owner']),
  scenes: defineTable({
    project: v.id('projects'),
    lockedNumber: v.union(v.number(), v.null()),
    description: v.string(),
    shotOrder: v.array(v.id('shots'))
  }).index('by_project', ['project']),
  shots: defineTable({
    scene: v.id('scenes'),
    status: vShotStatus,
    lockedNumber: v.union(v.number(), v.null()),
    description: v.string(),
    location: v.union(v.string(), v.null()),
    notes: v.string(),
  }).index('by_scene', ['scene']),
})
