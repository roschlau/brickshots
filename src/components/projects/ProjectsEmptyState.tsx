import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx'
import { FolderOpenIcon, PlusIcon } from 'lucide-react'
import { Authenticated, Unauthenticated } from 'convex/react'
import { Button } from '@/components/ui/button.tsx'
import { AccountControls } from '@/AccountControls.tsx'
import { PrivacyDialog } from '@/components/projects/PrivacyDialog.tsx'
import { SimpleTooltip } from '@/components/ui/tooltip.tsx'

export function ProjectsEmptyState({
  onNewProjectClicked,
}: {
  onNewProjectClicked: () => void,
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpenIcon />
        </EmptyMedia>
        <EmptyTitle>No Projects</EmptyTitle>
        <EmptyDescription>
          <Unauthenticated>
            Creating projects anonymously is not yet supported
            (see <a href="https://github.com/roschlau/brickshots/issues/13" target="_blank" rel="noreferrer">GitHub</a>).
            Sign in to get started.
          </Unauthenticated>
          <Authenticated>
            Create a new project to get started.
          </Authenticated>
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Authenticated>
            <Button onClick={onNewProjectClicked}>
              <PlusIcon />
              Create Project
            </Button>
          </Authenticated>
          <Unauthenticated>
            <SimpleTooltip text={'Log in to create a project'}>
              <span>
                <Button disabled>
                  <PlusIcon />
                  Create Project
                </Button>
              </span>
            </SimpleTooltip>
          </Unauthenticated>
          <AccountControls variant={'secondary'} />
        </div>
        <PrivacyDialog />
      </EmptyContent>
    </Empty>
  )
}
