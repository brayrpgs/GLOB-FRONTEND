import { MembershipPlan } from '../enums/MembershipPlan'
import { GetProject } from '../models/GetProject'
import { GetUserProject } from '../models/GetUserProject'
import { User } from '../models/User'
import { ProjectsUtils } from '../utils/ProjectsUtils'
import { TokenPayloadUtils } from '../utils/TokenPayloadUtils'
import { UserProjectUtils } from '../utils/UserProjectUtils'
import { UserUtils } from '../utils/UserUtils'
import { Validate } from './Validate'

class ValidateHome extends Validate {
  // validate method
  async validateWithLogin (): Promise<void> {
    const user: User = await this.getUser()
    const canView = [
      MembershipPlan.BASIC,
      MembershipPlan.PLUS,
      MembershipPlan.PRO
    ].includes(user.MEMBERSHIPPLAN_ID)
    console.log('canView:', canView)
    if (!canView) {
      this.redirectToMembership()
    }
  }

  redirectToMembership (): void {
    new ValidateHome('/membership').redirect()
  }

  async getUser (): Promise<User> {
    const tokenPayload = new TokenPayloadUtils().getTokenPayload()
    const user = await new UserUtils().get<User[]>(
      {
        user_id: tokenPayload.id
      }
    )
    if (user.length > 1 || user.length < 0) this.redirect()
    return user[0]
  }

  validateFields (data: Record<number, string>): boolean {
    let result = data[0].length > 0
    result = result && data[1].length > 0
    result = result && (new Date(data[2]) < new Date(data[3]))
    return result
  }

  async canCreateProject (): Promise<boolean> {
    // user
    const user = await this.getUser()
    // plan
    const membershipPlan: MembershipPlan = user.MEMBERSHIPPLAN_ID
    // user-project
    const userProject = await new UserProjectUtils().get<GetUserProject>(
      {
        user_id_fk: user.USER_ID
      }
    )
    // projects
    const projects = await new ProjectsUtils().get<GetProject>(
      {
        user_project_id_fk: userProject.data[0].USER_PROJECT_ID, page: 1, limit: 10
      }
    )
    // can create ?
    const canCreate = [
      MembershipPlan.BASIC,
      MembershipPlan.PLUS,
      MembershipPlan.PRO
    ].includes(membershipPlan)
    // which plans
    const havePlanBasic = membershipPlan === MembershipPlan.BASIC
    const havePlanPlus = membershipPlan === MembershipPlan.PLUS
    const havePlanPro = membershipPlan === MembershipPlan.PRO
    const numProjects = projects.totalData
    if (!canCreate) this.redirect()
    else if (canCreate && havePlanBasic && (numProjects < 1)) {
      return true
    } else if (canCreate && havePlanPlus && (numProjects < 3)) {
      return true
    } else if (canCreate && havePlanPro && (numProjects < 5)) {
      return true
    }
    return false
  }
}

export { ValidateHome }
