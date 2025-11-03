import { TOKEN_KEY_NAME } from '../common/Common'
import { TokenHelper } from '../Helpers/TokenHelper'
import { TokenPayload } from '../models/TokenPayload'

class TokenPayloadUtils {
  getTokenPayload (): TokenPayload {
    const token: string = localStorage.getItem(TOKEN_KEY_NAME) as string
    return new TokenHelper(token).decode()
  }
}
export { TokenPayloadUtils }
