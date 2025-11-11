import { ISSUES_TYPE_API_DATA_APLICATION_URL, TOKEN_KEY_NAME } from '../common/Common'
import { METHOD_HTTP, RESPONSE_TYPE } from '../Helpers/FetchHelper'
import { RequestHelper } from '../Helpers/RequestHelper'
import { Api } from '../interfaces/Api'
import { TokenPayload } from '../models/TokenPayload'

class IssueTypeUtils implements Api {
  token (): string { return localStorage.getItem(TOKEN_KEY_NAME) as string }
  get!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>;
  async post<T>(body: any): Promise<T> {
    const request = new RequestHelper(
      ISSUES_TYPE_API_DATA_APLICATION_URL,
      METHOD_HTTP.POST,
      RESPONSE_TYPE.JSON,
      body
    )
    request.addHeaders('accept', 'application/json')
    request.addHeaders('Content-Type', 'application/json')
    request.addHeaders('Authorization', this.token())
    return await request.buildRequest()
  }

  put!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  patch!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  delete!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  head!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
}
export { IssueTypeUtils }
