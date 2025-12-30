import { mutation, query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'
import { v } from 'convex/values'
import { editProject, isLoggedIn, withPermission } from './auth'

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []
    return await ctx.db.query('projects')
      .withIndex('by_owner', q => q.eq('owner', userId))
      .collect()
  },
})

export const getDetails = query({
  args: { projectId: v.id('projects') },
  handler: (ctx, { projectId }) => withPermission(ctx,
    editProject(projectId),
    async ({ project }) => {
      const scenes = await ctx.db.query('scenes')
        .withIndex('by_project', q => q.eq('project', projectId))
        .collect()
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
      const scenes = await ctx.db.query('scenes')
        .withIndex('by_project', q => q.eq('project', projectId))
        .collect()
      for (const scene of scenes) {
        const shots = await ctx.db.query('shots')
          .withIndex('by_scene', q => q.eq('scene', scene._id))
          .collect()
        for (const shot of shots) {
          await ctx.db.delete('shots', shot._id)
        }
        await ctx.db.delete('scenes', scene._id)
      }
      await ctx.db.delete('projects', projectId)
    },
  ),
})
