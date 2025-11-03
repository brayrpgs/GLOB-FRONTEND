import { MembershipPlan } from '../enums/MembershipPlan'
import { User } from '../models/User'
import { TokenPayloadUtils } from '../utils/TokenPayloadUtils'
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
    if (!canView) {
      this.redirect()
    }
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
}

export { ValidateHome }
