import { Issue } from './Issue'

export interface GetIssues {
  Issues: Issue[]
  page: number
  currentLimit: number
  totalData: number
}
