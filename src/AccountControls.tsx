import { useAuthActions } from '@convex-dev/auth/react'
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react'

export function AccountControls() {
  const { signIn, signOut } = useAuthActions()
  return (
    <>
      <AuthLoading>Loading...</AuthLoading>
      <Unauthenticated>
        <button onClick={() => void signIn('github')}>Sign in with GitHub</button>
      </Unauthenticated>
      <Authenticated>
        <button onClick={() => void signOut()}>Sign out</button>
      </Authenticated>
    </>
  )
}
