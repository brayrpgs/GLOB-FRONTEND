import { RESET_API_SECURITY_URL, TOKEN_KEY_NAME } from '../common/Common'
import { METHOD_HTTP, RESPONSE_TYPE } from '../Helpers/FetchHelper'
import { RequestHelper } from '../Helpers/RequestHelper'
import { Api } from '../interfaces/Api'
import { TokenPayload } from '../models/TokenPayload'

class RecoverPasswordUtils implements Api {
  token (): string {
    return localStorage.getItem(TOKEN_KEY_NAME) as string
  }

  get!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>;
  async post<T>(body?: any): Promise<T> {
    const request = new RequestHelper(
      RESET_API_SECURITY_URL,
      METHOD_HTTP.POST,
      RESPONSE_TYPE.JSON,
      body
    )
    request.addHeaders('Content-Type', 'application/json')
    return await request.buildRequest<T>()
  }

  put!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  patch!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  delete!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  head!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
}
export { RecoverPasswordUtils }
