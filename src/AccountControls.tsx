import { useAuthActions } from '@convex-dev/auth/react'
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react'
import { Button } from '@/components/ui/button.tsx'
import { GithubIcon } from '@/icons/GithubIcon.tsx'
import { LogOutIcon } from 'lucide-react'
import { ComponentProps } from 'react'

export function AccountControls({
  variant,
}: {
  variant?: ComponentProps<typeof Button>['variant']
}) {
  const { signIn, signOut } = useAuthActions()
  return (
    <>
      <AuthLoading>Loading...</AuthLoading>
      <Unauthenticated>
        <Button variant={variant ?? 'default'} onClick={() => void signIn('github')}>
          <GithubIcon/>
          Sign in with GitHub
        </Button>
      </Unauthenticated>
      <Authenticated>
        <Button
          onClick={() => void signOut()}
          variant="outline"
        >
          <LogOutIcon/>
          Sign out
        </Button>
      </Authenticated>
    </>
  )
}
