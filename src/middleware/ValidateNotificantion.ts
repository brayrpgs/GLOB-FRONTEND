import { MembershipPlan } from '../enums/MembershipPlan'
import { User } from '../models/User'
import { TokenPayloadUtils } from '../utils/TokenPayloadUtils'
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
    if (users[0].MEMBERSHIPPLAN_ID !== MembershipPlan.PRO) {
      this.redirect()
    }
  }
}
export { ValidateNotification }
