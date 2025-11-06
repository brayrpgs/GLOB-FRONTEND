import { IssueTypePriority } from '../enums/IssueTypePriority'
import { IssueTypeStatus } from '../enums/IssueTypeStatus'

export interface IssueType {
  ISSUE_TYPE_ID: number
  STATUS: IssueTypeStatus
  PRIORITY: IssueTypePriority
}
