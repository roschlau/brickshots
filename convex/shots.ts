import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { vShotStatus } from '../src/data-model/shot-status'

export const getForScene = query({
  args: {
    sceneId: v.id('scenes'),
  },
  handler: async (ctx, args) => {
    return (await ctx.db
      .query('shots')
      .withIndex('by_scene', (q) => q.eq('scene', args.sceneId))
      .collect())
  },
})

export const get = query({
  args: {
    id: v.id('shots'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get('shots', args.id)
  },
})

export const create = mutation({
  args: {
    sceneId: v.id('scenes'),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('shots', {
      scene: args.sceneId,
      description: '',
      status: 'default',
      location: args.location ?? '',
      notes: '',
      lockedNumber: null,
    })
  },
})

export const update = mutation({
  args: {
    shotId: v.id('shots'),
    data: v.object({
      status: v.optional(vShotStatus),
      lockedNumber: v.optional(v.union(v.number(), v.null())),
      description: v.optional(v.string()),
      location: v.optional(v.union(v.string(), v.null())),
      notes: v.optional(v.string()),
    })
  },
  handler: async (ctx, { shotId, data }) => {
    await ctx.db.patch(shotId, data)
  },
})

export const deleteShot = mutation({
  args: {
    shotId: v.id('shots'),
  },
  handler: async (ctx, { shotId }) => {
    const shot = await ctx.db.get('shots', shotId)
    if (!shot) return
    const shotOrder = (await ctx.db.get('scenes', shot.scene))?.shotOrder
    if (shotOrder?.includes(shotId)) {
      shotOrder.splice(shotOrder.indexOf(shotId), 1)
      await ctx.db.patch(shot.scene, { shotOrder })
    }
    await ctx.db.delete(shotId)
  }
})
