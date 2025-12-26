import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { api } from './_generated/api'

export const getForProjectWithShots = query({
  args: {
    projectId: v.optional(v.id('projects')),
  },
  handler: async (ctx, { projectId }) => {
    if (!projectId) return []
    const scenes = await ctx.db
      .query('scenes')
      .withIndex('by_project', (q) => q.eq('project', projectId))
      .collect()
    return await Promise.all(scenes.map(async scene => {
      const shots = await ctx.db
        .query('shots')
        .withIndex('by_scene', (q) => q.eq('scene', scene._id))
        .collect()
      return {
        ...scene,
        shots,
      }
    }))
  },
})

export const get = query({
  args: {
    id: v.id('scenes'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get('scenes', args.id)
  },
})

export const create = mutation({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, { projectId }) => {
    return await ctx.db.insert('scenes', {
      project: projectId,
      lockedNumber: null,
      description: '',
      shotOrder: [],
    })
  },
})

export const update = mutation({
  args: {
    sceneId: v.id('scenes'),
    data: v.object({
      lockedNumber: v.optional(v.union(v.number(), v.null())),
      description: v.optional(v.string()),
      shotOrder: v.optional(v.array(v.id('shots'))),
    })
  },
  handler: async (ctx, { sceneId, data }) => {
    await ctx.db.patch(sceneId, data)
  },
})

export const deleteScene = mutation({
  args: {
    sceneId: v.id('scenes'),
  },
  handler: async (ctx, { sceneId }) => {
    const shots = await ctx.db
      .query('shots')
      .withIndex('by_scene', (q) => q.eq('scene', sceneId))
      .collect()
    for (const shot of shots) {
      await ctx.runMutation(api.shots.deleteShot, { shotId: shot._id })
    }
    await ctx.db.delete(sceneId)
  }
})
