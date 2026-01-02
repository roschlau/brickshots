import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { api } from './_generated/api'
import { editProject, editScene, withPermission } from './auth'
import { getManyFrom } from 'convex-helpers/server/relationships'

export const getForProjectWithShots = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: (ctx, { projectId }) => withPermission(ctx,
    editProject(projectId),
    async ({ project }) => {
      const scenes = await getManyFrom(ctx.db, 'scenes', 'by_project', project._id)
      return await Promise.all(scenes.map(async scene => {
        const shots = await getManyFrom(ctx.db, 'shots', 'by_scene', scene._id)
        return {
          ...scene,
          shots,
        }
      }))
    },
  ),
})

export const get = query({
  args: {
    id: v.id('scenes'),
  },
  handler: (ctx, args) => withPermission(ctx,
    editScene(args.id),
    ({ scene }) => Promise.resolve(scene),
  ),
})

export const create = mutation({
  args: {
    projectId: v.id('projects'),
  },
  handler: (ctx, { projectId }) => withPermission(ctx,
    editProject(projectId),
    async ({ project }) => {
      const sceneId = await ctx.db.insert('scenes', {
        project: project._id,
        lockedNumber: null,
        description: '',
        shotOrder: [],
      })
      await ctx.runMutation(api.shots.create, { sceneId })
      return sceneId
    },
  ),
})

export const update = mutation({
  args: {
    sceneId: v.id('scenes'),
    data: v.object({
      lockedNumber: v.optional(v.union(v.number(), v.null())),
      description: v.optional(v.string()),
      shotOrder: v.optional(v.array(v.id('shots'))),
    }),
  },
  handler: (ctx, { sceneId, data }) => withPermission(ctx,
    editScene(sceneId),
    async ({ scene }) => {
      await ctx.db.patch(scene._id, data)
    },
  ),
})

export const deleteScene = mutation({
  args: {
    sceneId: v.id('scenes'),
  },
  handler: (ctx, { sceneId }) => withPermission(ctx,
    editScene(sceneId),
    async ({ scene }) => {
      const shots = await getManyFrom(ctx.db, 'shots', 'by_scene', scene._id)
      for (const shot of shots) {
        await ctx.runMutation(api.shots.deleteShot, { shotId: shot._id })
      }
      await ctx.db.delete(sceneId)
    },
  ),
})
