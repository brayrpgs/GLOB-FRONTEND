import { ANALYZE_PROJECT_BY_AI_URL, TOKEN_KEY_NAME } from '../common/Common'
import { METHOD_HTTP, RESPONSE_TYPE } from '../Helpers/FetchHelper'
import { RequestHelper } from '../Helpers/RequestHelper'
import { Api } from '../interfaces/Api'
import { TokenPayload } from '../models/TokenPayload'

class AnalizeUtils implements Api {
  token (): string {
    return localStorage.getItem(TOKEN_KEY_NAME) as string
  }

  async get<T>(path?: any): Promise<T> {
    const request = new RequestHelper(
      `${ANALYZE_PROJECT_BY_AI_URL}/${path as number}`,
      METHOD_HTTP.GET,
      RESPONSE_TYPE.JSON
    )
    request.addHeaders('Content-Type', 'application/json')
    return await request.buildRequest()
  }

  post!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  put!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  patch!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  delete!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  head!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
}
export { AnalizeUtils }
