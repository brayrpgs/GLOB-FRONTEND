import { jwtDecode } from 'jwt-decode'
import { TokenPayload } from '../models/TokenPayload'

class TokenHelper {
  private readonly token: string

  constructor (token: string) {
    this.token = token
  }

  public decode (): TokenPayload {
    return jwtDecode<TokenPayload>(this.token)
  }
}
export { TokenHelper }
