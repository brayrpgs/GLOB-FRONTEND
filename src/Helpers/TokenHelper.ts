import { jwtDecode } from 'jwt-decode'
import { TokenPayload } from '../models/TokenPayload'

class TokenUtils {
  private readonly token: string

  constructor (token: string) {
    this.token = token
  }

  public decode (): TokenPayload {
    return jwtDecode<TokenPayload>(this.token)
  }
}
export { TokenUtils }
