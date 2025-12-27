import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { vShotStatus } from '../src/data-model/shot-status'
import { editScene, editShot, withPermission } from './auth'

export const getForScene = query({
  args: {
    sceneId: v.id('scenes'),
  },
  handler: (ctx, { sceneId }) => withPermission(ctx,
    editScene(sceneId),
    async () => {
      return (await ctx.db
        .query('shots')
        .withIndex('by_scene', (q) => q.eq('scene', sceneId))
        .collect())
    },
  ),
})

export const get = query({
  args: {
    id: v.id('shots'),
  },
  handler: (ctx, args) => withPermission(ctx,
    editShot(args.id),
    async () => {
      return await ctx.db.get('shots', args.id)
    }),
})

export const create = mutation({
  args: {
    sceneId: v.id('scenes'),
    location: v.optional(v.string()),
  },
  handler: (ctx, { sceneId, location }) => withPermission(ctx,
    editScene(sceneId),
    async () => {
      return await ctx.db.insert('shots', {
        scene: sceneId,
        description: '',
        status: 'default',
        location: location ?? '',
        notes: '',
        lockedNumber: null,
      })
    },
  ),
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
    }),
  },
  handler: (ctx, { shotId, data }) => withPermission(ctx,
    editShot(shotId),
    async () => {
      await ctx.db.patch(shotId, data)
    },
  ),
})

export const deleteShot = mutation({
  args: {
    shotId: v.id('shots'),
  },
  handler: (ctx, { shotId }) => withPermission(ctx,
    editShot(shotId),
    async () => {
      const shot = await ctx.db.get('shots', shotId)
      if (!shot) return
      const shotOrder = (await ctx.db.get('scenes', shot.scene))?.shotOrder
      if (shotOrder?.includes(shotId)) {
        shotOrder.splice(shotOrder.indexOf(shotId), 1)
        await ctx.db.patch(shot.scene, { shotOrder })
      }
      await ctx.db.delete(shotId)
    },
  ),
})
