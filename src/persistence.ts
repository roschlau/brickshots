import {newProject, ProjectData} from './data-model/project.ts'

export function loadProject(): ProjectData {
  const existing = localStorage.getItem('project')
  if (existing) {
    return JSON.parse(existing) as ProjectData
  }
  return newProject()
}
