
export interface Issue {
  ISSUE_ID: number
  SUMMARY: string
  DESCRIPTION: string
  AUDIT_ID_FK: number
  RESOLVE_AT: string
  DUE_DATE: string
  VOTES: number
  ORIGINAL_ESTIMATION: number
  CUSTOM_START_DATE: string
  STORY_POINT_ESTIMATE: number
  PARENT_SUMMARY_FK: number
  ISSUE_TYPE: number
  PROJECT_ID_FK: number
  USER_ASSIGNED_FK: number
  USER_CREATOR_ISSUE_FK: number
  USER_INFORMATOR_ISSUE_FK: number
  SPRINT_ID_FK: number
  STATUS_ISSUE: number
}
