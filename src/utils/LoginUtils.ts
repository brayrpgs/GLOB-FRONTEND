import { LOGIN_API_SECURITY_URL, TOKEN_KEY_NAME } from '../common/Common'
import { METHOD_HTTP, RESPONSE_TYPE } from '../Helpers/FetchHelper'
import { RequestHelper } from '../Helpers/RequestHelper'
import { Api } from '../interfaces/Api'

class LoginUtils implements Api {
  token (): string {
    return localStorage.getItem(TOKEN_KEY_NAME) as string
  }

  get!: <T>() => Promise<T>
  async post<T>(body?: any): Promise<T> {
    const request = new RequestHelper(
      LOGIN_API_SECURITY_URL,
      METHOD_HTTP.POST,
      RESPONSE_TYPE.TEXT,
      body
    )
    request.addHeaders('Content-Type', 'application/json')
    return await request.buildRequest<T>()
  }

  put!: <T>() => Promise<T>
  patch!: <T>() => Promise<T>
  delete!: <T>() => Promise<T>
  head!: <T>() => Promise<T>
}
export { LoginUtils }
