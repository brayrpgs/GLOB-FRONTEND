import { Project } from './Project'

export interface GetProject {
  data: Project[]
  page: number
  currentLimit: number
  totalData: number
}
