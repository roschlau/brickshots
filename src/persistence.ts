import {newProject, ProjectData} from './data-model/project.ts'

export function loadProject(): ProjectData {
  const existing = localStorage.getItem('project')
  if (existing) {
    return JSON.parse(existing) as ProjectData
  }
  return newProject()
}

export function download(project: ProjectData) {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(project)))
  element.setAttribute('download', 'brickshot-project.json')
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export async function openProject(file: File): Promise<ProjectData> {
  if (!file.type.startsWith('application/json')) {
    throw Error('Project files need to be JSON, file was ' + file.type)
  }
  return JSON.parse(await file.text()) as ProjectData
}
