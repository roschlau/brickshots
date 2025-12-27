import { convexAuth, getAuthUserId } from '@convex-dev/auth/server'
import GitHub from '@auth/core/providers/github'
import { Id } from './_generated/dataModel'
import { QueryCtx } from './_generated/server'

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub],
})

export type Permission<T> = (ctx: QueryCtx) => Promise<T | null>

export const editProject = (projectId: Id<'projects'>) => async (ctx: QueryCtx) => {
  const project = await ctx.db.get('projects', projectId)
  if (!project || project.owner !== await getAuthUserId(ctx)) return null
  return { project }
}

export const editScene = (sceneId: Id<'scenes'>) => async (ctx: QueryCtx) => {
  const scene = await ctx.db.get('scenes', sceneId)
  if (!scene) return null
  const projectResult = await editProject(scene.project)(ctx)
  if (!projectResult) return null
  return { ...projectResult, scene }
}

export const editShot = (shotId: Id<'shots'>) => async (ctx: QueryCtx) => {
  const shot = await ctx.db.get('shots', shotId)
  if (!shot) return null
  const sceneResult = await editScene(shot.scene)(ctx)
  if (!sceneResult) return null
  return { ...sceneResult, shot }
}

export async function withPermission<A, T>(
  ctx: QueryCtx,
  permission: Permission<A>,
  handler: (authResult: NonNullable<A>) => Promise<T>,
): Promise<T | null> {
  const permissionResult = await permission(ctx)
  if (!permissionResult) return null
  return handler(permissionResult)
}
