import { TOKEN_KEY_NAME, USER_API_SECURITY_URL } from '../common/Common'
import { METHOD_HTTP, RESPONSE_TYPE } from '../Helpers/FetchHelper'
import { RequestHelper } from '../Helpers/RequestHelper'
import { TokenHelper } from '../Helpers/TokenHelper'
import { User } from '../models/User'
import { Validate } from './Validate'

class ValidateHome extends Validate {
  // validate method
  async validateWithLogin (): Promise<void> {
    const user: User = await this.getUser()
    console.table(user)
    // user.MEMBERSHIPPLAN_ID ?? this.redirect() // uncommented after implements MEMBERSHIPPLAN
  }

  async getUser (): Promise<User> {
    const token = new TokenHelper(localStorage.getItem(TOKEN_KEY_NAME) as string)
    console.table(token)
    const request = new RequestHelper(
      USER_API_SECURITY_URL,
      METHOD_HTTP.GET,
      RESPONSE_TYPE.JSON,
      null,
      { user_id: token.decode().id }
    )
    request.addHeaders('accept', 'application/json')
    const user = await request.buildRequest<User[]>()
    console.table(user)
    if (user.length > 1 || user.length < 0) this.redirect()
    return user[0]
  }
}

export { ValidateHome }
