import { IssueType } from './IssueType'

export interface GetIssueType {
  Issue_type: IssueType[]
  page: number
  currentLimit: number
  totalData: number
}
