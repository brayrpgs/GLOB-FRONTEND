import { IssueUtils } from './IssueUtils'
import { UserProjectUtils } from './UserProjectUtils'
import { URLHelper } from '../Helpers/URLHelper'
import { GetIssues } from '../models/GetIssues'

export async function getUserProductivity (userId: number): Promise<{ total: number, done: number }> {
  try {
    const projectId = new URLHelper().getPathId()
    const issueUtils = new IssueUtils()
    const userProjectUtils = new UserProjectUtils()

    const userProjectsResponse = await userProjectUtils.get<any>({ user_id_fk: userId })
    const userProjects = Array.isArray(userProjectsResponse)
      ? userProjectsResponse
      : userProjectsResponse?.data ?? []

    if (userProjects.length === 0) {
      return { total: 0, done: 0 }
    }

    const issuesResponse = await issueUtils.get<GetIssues>({ project_id_fk: projectId })
    const issues = issuesResponse.Issues ?? []

    const userProjectIds = userProjects.map((up: any) => up.USER_PROJECT_ID)
    const userIssues = issues.filter((i) => userProjectIds.includes(i.USER_ASSIGNED_FK))

    const total = userIssues.length
    const done = userIssues.filter((i) => i.STATUS_ISSUE === 3).length

    return { total, done }
  } catch (err) {
    console.error('Error in getUserProductivity:', err)
    return { total: 0, done: 0 }
  }
}
