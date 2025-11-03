import { ProjectStatus } from '../enums/ProjectStatus'

interface Project {
  PROJECT_ID: number
  NAME: string
  DESCRIPTION: string
  USER_PROJECT_ID_FK: number
  DATE_INIT: string
  DATE_END: string
  STATUS: ProjectStatus
  PROGRESS: number
}

export type { Project }
