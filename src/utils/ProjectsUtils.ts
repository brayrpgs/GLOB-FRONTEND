import { PROJECT_API_DATA_APLICATION_URL, TOKEN_KEY_NAME } from '../common/Common'
import { METHOD_HTTP, RESPONSE_TYPE } from '../Helpers/FetchHelper'
import { RequestHelper } from '../Helpers/RequestHelper'
import { Api } from '../interfaces/Api'
import { TokenPayload } from '../models/TokenPayload'

class ProjectsUtils implements Api {
  token (): string {
    return localStorage.getItem(TOKEN_KEY_NAME) as string
  }

  async get<T>(params?: any): Promise<T> {
    const request = new RequestHelper(
      PROJECT_API_DATA_APLICATION_URL,
      METHOD_HTTP.GET,
      RESPONSE_TYPE.JSON,
      null,
      params
    )
    request.addHeaders('accept', 'application/json')
    request.addHeaders('Authorization', this.token())
    return await request.buildRequest()
  }

  post!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  put!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  patch!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  delete!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  head!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
}
export { ProjectsUtils }
