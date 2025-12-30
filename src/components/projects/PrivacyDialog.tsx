import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ShieldQuestionMarkIcon } from 'lucide-react'

export function PrivacyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'link'}
          className="text-muted-foreground"
          size="sm"
        >
          <ShieldQuestionMarkIcon /> Privacy Policy
        </Button>
      </DialogTrigger>
      <DialogContent className={'prose dark:prose-invert prose-sm prose-slate gap-0'}>
        <DialogHeader>
          <DialogTitle asChild>
            <h1>BrickShot Privacy Policy</h1>
          </DialogTitle>
          <DialogDescription>
            These terms apply to BrickShot, a free tool for managing shot lists for short films.
            They may be updated from time to time.
          </DialogDescription>
        </DialogHeader>
        <h2>
          Nature of this project
        </h2>
        <p>
          BrickShot is developed as a hobby project. As such it comes with no guarantees and may exhibit unexpected quirks or limitations.
          If you are using it for anything important, frequently back up your projects to protect yourself against data loss due to bugs or other unexpected circumstances.
        </p>
        <h2>
          Data Collection and Usage
        </h2>
        <p>
          BrickShot collects and processes only the necessary data to work correctly.
          BrickShot does not show ads, profile your behavior, or sell your data to a third party.
        </p>
        <p>
          Users can optionally log in with an external identity provider to more easily access their projects across devices,
          in which case limited user data like an email address, user name and a link to the identity provider are stored.
          BrickShot does not store any passwords and does not gain access to the account you are logging in with.
          The respective identity provider&#39;s terms privacy policy and terms apply to your usage of their services.
          Currently, GitHub is the only supported identity provider, more may be added in the future.
        </p>
        <p>
          If you are logged in, your email address may be used to verify your identity, protect against abuse, and contact you regarding important matters related to your use of BrickShots.
          It will never be used to send you ads or other unsolicited emails.
        </p>
        <h2>
          Convex
        </h2>
        <p>
          BrickShot uses <a href="https://www.convex.dev/" target="_blank" rel="noreferrer">Convex Systems, Inc.</a> (&quot;Convex&quot;) to provide backend infrastructure and storage.
          In this capacity, Convex stores and processes the data you provide on BrickShot&apos;s behalf, subject to Convex&apos;s <a href="https://www.convex.dev/legal/dpa/" target="_blank" rel="noreferrer">Data Processing Agreement.</a>
        </p>
      </DialogContent>
    </Dialog>
  )
}
