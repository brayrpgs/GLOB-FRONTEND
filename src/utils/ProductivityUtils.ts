import { IssueUtils } from '../utils/IssueUtils'
import { UserProjectUtils } from '../utils/UserProjectUtils'
import { URLHelper } from '../Helpers/URLHelper'
import { GetIssues } from '../models/GetIssues'

export async function getUserProductivity (userId: number): Promise<{ total: number, done: number }> {
  try {
    const projectId = new URLHelper().getPathId()
    const issueUtils = new IssueUtils()
    const userProjectUtils = new UserProjectUtils()
    const userProjects: any = await userProjectUtils.get<any>({ user_id_fk: userId })

    const projectList = Array.isArray(userProjects)
      ? userProjects
      : userProjects?.data ?? []

    console.log(projectList)

    const isInProject: boolean = Boolean(projectList?.some((p: any) => p?.USER_PROJECT_ID === projectId))
    if (!isInProject) {
      return { total: 0, done: 0 }
    }

    const issuesResponse = await issueUtils.get<GetIssues>({ project_id_fk: projectId })
    const issues = issuesResponse.Issues ?? []

    const userIssues = issues.filter((i) => i.USER_ASSIGNED_FK === userId)
    const total = userIssues.length
    const done = userIssues.filter((i) => i.STATUS_ISSUE === 3).length

    return { total, done }
  } catch (err) {
    console.error('Error in getUserProductivity:', err)
    return { total: 0, done: 0 }
  }
}
