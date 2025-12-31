import { mutation, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { editProject, isLoggedIn, withPermission } from './auth'
import { getManyFrom } from 'convex-helpers/server/relationships'
import { api } from './_generated/api'

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []
    return await getManyFrom(ctx.db, 'projects', 'by_owner', userId)
  },
})

export const getDetails = query({
  args: { projectId: v.id('projects') },
  handler: (ctx, { projectId }) => withPermission(ctx,
    editProject(projectId),
    async ({ project }) => {
      const scenes = await getManyFrom(ctx.db, 'scenes', 'by_project', projectId)
      return {
        ...project,
        scenesCount: scenes.length,
      }
    },
  ),
})

export const create = mutation({
  args: {},
  handler: (ctx) => withPermission(ctx,
    isLoggedIn,
    async ({ userId }) => {
      return await ctx.db.insert('projects', {
        owner: userId,
        name: 'New Project',
      })
    },
  ),
})

export const deleteProject = mutation({
  args: { projectId: v.id('projects') },
  handler: (ctx, { projectId }) => withPermission(ctx,
    editProject(projectId),
    async () => {
      const scenes = await getManyFrom(ctx.db, 'scenes', 'by_project', projectId)
      for (const scene of scenes) {
        await ctx.runMutation(api.scenes.deleteScene, { sceneId: scene._id })
      }
      await ctx.db.delete('projects', projectId)
    },
  ),
})
