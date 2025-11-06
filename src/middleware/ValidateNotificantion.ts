import { MembershipPlan } from '../enums/MembershipPlan'
import { GetUserProject } from '../models/GetUserProject'
import { User } from '../models/User'
import { TokenPayloadUtils } from '../utils/TokenPayloadUtils'
import { UserProjectUtils } from '../utils/UserProjectUtils'
import { UserUtils } from '../utils/UserUtils'
import { Validate } from './Validate'

class ValidateNotification extends Validate {
  async validateWithLogin (): Promise<void> {
    const tokenPayload = new TokenPayloadUtils().getTokenPayload()
    const users = await new UserUtils().get<User[]>(
      {
        user_id: tokenPayload.id
      }
    )

    const user = users[0]

    if (user.MEMBERSHIPPLAN_ID !== MembershipPlan.PRO) {
      this.redirect()
      return
    }

    const userProjects = await new UserProjectUtils().get<GetUserProject>({
      user_id_fk: user.USER_ID
    })

    if (userProjects.totalData === 0) {
      this.redirect()
    }
  }
}
export { ValidateNotification }
