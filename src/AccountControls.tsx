import { useAuthActions } from '@convex-dev/auth/react'
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react'
import { Button } from '@/components/ui/button.tsx'
import { GithubIcon } from '@/icons/GithubIcon.tsx'
import { LogOutIcon } from 'lucide-react'
import { ComponentProps, useState } from 'react'
import { Spinner } from '@/components/ui/spinner.tsx'

export function AccountControls({
  variant,
}: {
  variant?: ComponentProps<typeof Button>['variant']
}) {
  const { signOut } = useAuthActions()
  return (
    <>
      <AuthLoading>Loading...</AuthLoading>
      <Unauthenticated>
        <SignInButton variant={variant} />
      </Unauthenticated>
      <Authenticated>
        <Button
          onClick={() => void signOut()}
          variant="outline"
        >
          <LogOutIcon />
          Sign out
        </Button>
      </Authenticated>
    </>
  )
}

export function SignInButton({
  variant,
}: {
  variant?: ComponentProps<typeof Button>['variant']
}) {
  const { signIn } = useAuthActions()
  const [loading, setLoading] = useState(false)
  const clicked = () => {
    setLoading(true)
    void signIn('github')
  }
  return (
    <Button variant={variant ?? 'default'} onClick={clicked}>
      {loading ? <Spinner /> : <GithubIcon />}
      Sign in with GitHub
    </Button>
  )
}
