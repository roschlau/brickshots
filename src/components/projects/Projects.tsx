import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { ProjectsEmptyState } from '@/components/projects/ProjectsEmptyState.tsx'
import { Id } from '../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button.tsx'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item.tsx'
import { Skeleton } from '@/components/ui/skeleton.tsx'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { AccountControls } from '@/AccountControls.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'

export function Projects({
  onProjectSelected,
}: {
  onProjectSelected: (projectId: Id<'projects'>) => void
}) {
  const projects = useQuery(api.projects.getAll)
  const createProject = useMutation(api.projects.create)
  const deleteProject = useMutation(api.projects.deleteProject)
  if (!projects) {
    return <Spinner className={'size-12'}/>
  }
  return projects.length === 0
    ? <ProjectsEmptyState onNewProjectClicked={() => void createProject()} />
    : (
      <div className={'flex flex-col w-xl max-w-full gap-10 p-2'}>
        <div className={'flex flex-row items-center gap-2'}>
          <h1 className={'text-3xl my-4 grow'}>
            Your Projects
          </h1>
          <AccountControls/>
          <Button
            className={'mb-4 self-end'}
            onClick={() => void createProject()}
          >
            <PlusIcon />
            New
          </Button>
        </div>
        <ul className={'flex flex-col gap-4'}>
          {projects.map(project => (
            <ProjectTile
              key={project._id}
              projectId={project._id}
              projectName={project.name}
              onOpenClicked={() => onProjectSelected(project._id)}
              onDeleteClicked={() => void deleteProject({projectId: project._id})}
            />
          ))}
        </ul>
      </div>
    )
}

function ProjectTile({
  projectId,
  projectName,
  onOpenClicked,
  onDeleteClicked,
}: {
  projectId: Id<'projects'>,
  projectName: string,
  onOpenClicked?: () => void,
  onDeleteClicked?: () => void,
}) {
  const projectDetails = useQuery(api.projects.getDetails, { projectId })
  return (
    <li>
      <Item variant={'outline'}>
        <ItemContent>
          <ItemTitle>{projectName}</ItemTitle>
          {projectDetails
            ? <ItemDescription>{projectDetails.scenesCount.toString()} Scenes</ItemDescription>
            : <Skeleton className={'h-5.25 w-16 rounded-full'} />
          }
        </ItemContent>
        <ItemActions>
          <Button
            variant={'outline'}
            onClick={onOpenClicked}
          >
            Open
          </Button>
          <Button
            variant={'destructive'}
            onClick={onDeleteClicked}
          >
            <TrashIcon/>
          </Button>
        </ItemActions>
      </Item>
    </li>
  )
}
