import { UserProject } from './UserProject'

interface GetUserProject {
  data: UserProject[]
  page: number
  currentLimit: number
  totalData: number
}
export type { GetUserProject }
