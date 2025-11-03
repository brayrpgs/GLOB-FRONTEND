import { TOKEN_KEY_NAME } from '../common/Common'
import { MembershipPlan } from '../enums/MembershipPlan'
import { User } from '../models/User'
import { TokenPayloadUtils } from '../utils/TokenPayloadUtils'
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
}

export { ValidateHeader }
