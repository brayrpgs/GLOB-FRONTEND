import { TOKEN_KEY_NAME, USER_API_SECURITY_URL } from '../common/Common'
import { MembershipPlan } from '../enums/MembershipPlan'
import { METHOD_HTTP, RESPONSE_TYPE } from '../Helpers/FetchHelper'
import { RequestHelper } from '../Helpers/RequestHelper'
import { TokenHelper } from '../Helpers/TokenHelper'
import { User } from '../models/User'
import { Validate } from './Validate'

class ValidateNotification extends Validate {
  async validateWithLogin (): Promise<void> {
    const token = new TokenHelper(localStorage.getItem(TOKEN_KEY_NAME) as string)
    const tokenPayload = token.decode()
    // user request
    const request = new RequestHelper(
      USER_API_SECURITY_URL,
      METHOD_HTTP.GET,
      RESPONSE_TYPE.JSON,
      null,
      {
        user_id: tokenPayload.id
      }
    )
    request.addHeaders('accept', 'application/json')
    const users = await request.buildRequest<User[]>()
    if (users[0].MEMBERSHIPPLAN_ID !== MembershipPlan.PRO) {
      this.redirect()
    }
  }
}
export { ValidateNotification }
