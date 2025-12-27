import { query } from './_generated/server'
import { getAuthUserId } from '@convex-dev/auth/server'

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
