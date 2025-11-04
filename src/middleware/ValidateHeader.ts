import { TOKEN_KEY_NAME } from '../common/Common'
import { MembershipPlan } from '../enums/MembershipPlan'
import { GetProject } from '../models/GetProject'
import { GetUserProject } from '../models/GetUserProject'
import { TokenPayload } from '../models/TokenPayload'
import { User } from '../models/User'
import { ProjectsUtils } from '../utils/ProjectsUtils'
import { TokenPayloadUtils } from '../utils/TokenPayloadUtils'
import { UserProjectUtils } from '../utils/UserProjectUtils'
import { UserUtils } from '../utils/UserUtils'
import { Validate } from './Validate'

class ValidateHeader extends Validate {
  async validateWithLogin (): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getPlan (): Promise<MembershipPlan | null> {
    // step 1
    const token = localStorage.getItem(TOKEN_KEY_NAME) as string
    const tokenPayload = new TokenPayloadUtils().getTokenPayload()
    if (token === null) return null
    // step 2
    const getUser = await new UserUtils().get<User[]>(
      {
        user_id: tokenPayload.id
      }
    )
    if (getUser.length < 1 || getUser.length > 1) return null
    // step 3
    return getUser[0].MEMBERSHIPPLAN_ID
  }

  async validateImport (): Promise<boolean> {
    // user id
    const tokenPayload: TokenPayload = new TokenPayloadUtils().getTokenPayload()
    // user - project
    const userProject: GetUserProject = await new UserProjectUtils().get<GetUserProject>(
      {
        user_id_fk: tokenPayload.id
      }
    )
    // project
    const project: GetProject = await new ProjectsUtils().get<GetProject>(
      {
        user_project_id_fk: userProject.data[0].USER_PROJECT_ID
      }
    )

    // get plan
    const plan = await this.getPlan()

    // validate
    const canImport = [MembershipPlan.PLUS, MembershipPlan.PRO].includes(plan as MembershipPlan)

    if (canImport && MembershipPlan.PLUS === plan && project.totalData < 3) {
      return true
    } else if (canImport && MembershipPlan.PRO === plan && project.totalData < 5) {
      return true
    }
    return false
  }

  validateAiUrl (): boolean {
    const url: string = window.location.href
    return url.includes('/project')
  }
}

export { ValidateHeader }
