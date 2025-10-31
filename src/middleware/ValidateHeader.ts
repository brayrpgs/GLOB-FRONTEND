import { TOKEN_KEY_NAME, USER_API_SECURITY_URL } from '../common/Common'
import { MembershipPlan } from '../enums/MembershipPlan'
import { METHOD_HTTP, RESPONSE_TYPE } from '../Helpers/FetchHelper'
import { RequestHelper } from '../Helpers/RequestHelper'
import { TokenHelper } from '../Helpers/TokenHelper'
import { User } from '../models/User'
import { Validate } from './Validate'

class ValidateHeader extends Validate {
  async validateWithLogin (): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async isProUser (): Promise<boolean> {
    // step 1
    const token = localStorage.getItem(TOKEN_KEY_NAME) as string
    const tokenPayload = new TokenHelper(token)
    if (token === null) return false
    // step 2
    const requestUser = new RequestHelper(
      USER_API_SECURITY_URL,
      METHOD_HTTP.GET,
      RESPONSE_TYPE.JSON,
      null,
      {
        user_id: tokenPayload.decode().id
      }
    )
    requestUser.addHeaders('Authorization', token)
    requestUser.addHeaders('accept', 'application/json')
    const getUser = await requestUser.buildRequest<User[]>()
    if (getUser.length < 1 || getUser.length > 1) return false
    // step 3
    return getUser[0].MEMBERSHIPPLAN_ID === MembershipPlan.PRO
  }
}

export { ValidateHeader }
