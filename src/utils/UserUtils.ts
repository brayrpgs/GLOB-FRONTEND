import { TOKEN_KEY_NAME, USER_API_SECURITY_URL } from '../common/Common'
import { METHOD_HTTP, RESPONSE_TYPE } from '../Helpers/FetchHelper'
import { RequestHelper } from '../Helpers/RequestHelper'
import { Api } from '../interfaces/Api'
import { TokenPayload } from '../models/TokenPayload'

class UserUtils implements Api {
  token (): string { return localStorage.getItem(TOKEN_KEY_NAME) as string }
  async get<T>(params?: any): Promise<T> {
    const request = new RequestHelper(
      USER_API_SECURITY_URL,
      METHOD_HTTP.GET,
      RESPONSE_TYPE.JSON,
      null,
      params
    )
    request.addHeaders('Content-Type', 'application/json')
    return await request.buildRequest()
  }

  post!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  async put<T>(body?: any): Promise<T> {
    const request = new RequestHelper(
      USER_API_SECURITY_URL,
      METHOD_HTTP.PUT,
      RESPONSE_TYPE.JSON,
      body
    )
    request.addHeaders('Content-Type', 'application/json')
    return await request.buildRequest()
  }

  patch!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  delete !: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  head!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
}
export { UserUtils }
