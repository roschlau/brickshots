import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty.tsx'
import { FolderOpenIcon, PlusIcon } from 'lucide-react'
import { Authenticated, Unauthenticated } from 'convex/react'
import { Button } from '@/components/ui/button.tsx'
import { AccountControls } from '@/AccountControls.tsx'
import { PrivacyDialog } from '@/components/projects/PrivacyDialog.tsx'

export function ProjectsEmptyState({
  onNewProjectClicked,
} : {
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
            Creating projects anonymously is not yet supported. Sign in to open an existing project.
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
            <Button disabled>
              <PlusIcon />
              Create Project
            </Button>
          </Unauthenticated>
          <AccountControls variant={'secondary'} />
        </div>
        <PrivacyDialog/>
      </EmptyContent>
    </Empty>
  )
}
