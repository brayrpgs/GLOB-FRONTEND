import { ProjectRole } from '../enums/ProjectRole'

export interface UserProject {
  USER_PROJECT_ID: number
  USER_ID_FK: number
  ROL_PROYECT: ProjectRole
  PRODUCTIVITY: number
}
