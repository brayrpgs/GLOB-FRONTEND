import { jwtDecode } from 'jwt-decode'
import { TokenPayload } from '../models/TokenPayload'

class TokenUtils {
  private readonly token: string

  constructor (token: string) {
    this.token = token
  }

  public getToken (): TokenPayload {
    return jwtDecode<TokenPayload>(this.token)
  }

  public isValid (): boolean {
    return true
  }
}
export { TokenUtils }
