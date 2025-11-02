import { TOKEN_KEY_NAME, USER_PROJECT_API_DATA_APLICATION_URL } from '../common/Common'
import { METHOD_HTTP, RESPONSE_TYPE } from '../Helpers/FetchHelper'
import { RequestHelper } from '../Helpers/RequestHelper'
import { Api } from '../interfaces/Api'
import { TokenPayloadUtils } from './TokenPayloadUtils'

class UserProjectUtils implements Api {
  tokenPayload = new TokenPayloadUtils().getTokenPayload()

  token (): string {
    return localStorage.getItem(TOKEN_KEY_NAME) as string
  }

  async get<T>(params: any): Promise<T> {
    const requestUser = new RequestHelper(
      USER_PROJECT_API_DATA_APLICATION_URL,
      METHOD_HTTP.GET,
      RESPONSE_TYPE.JSON,
      null,
      {
        user_id_fk: this.tokenPayload.id,
        page: 1,
        limit: 10
      }
    )
    requestUser.addHeaders('Authorization', this.token())
    requestUser.addHeaders('accept', 'application/json')
    return await requestUser.buildRequest<T>()
  }

  post!: <T>(body?: any, params?: any, path?: any) => Promise<T>
  put!: <T>(body?: any, params?: any, path?: any) => Promise<T>
  patch!: <T>(body?: any, params?: any, path?: any) => Promise<T>
  delete!: <T>(body?: any, params?: any, path?: any) => Promise<T>
  head!: <T>(body?: any, params?: any, path?: any) => Promise<T>
}
export { UserProjectUtils }
