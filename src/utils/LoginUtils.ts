import { TOKEN_KEY_NAME, USER_PROJECT_API_DATA_APLICATION_URL } from '../common/Common'
import { METHOD_HTTP, RESPONSE_TYPE } from '../Helpers/FetchHelper'
import { RequestHelper } from '../Helpers/RequestHelper'
import { Api } from '../interfaces/Api'

class LoginUtils implements Api {
  token (): string {
    return localStorage.getItem(TOKEN_KEY_NAME) as string
  }

  async get<T>(params: any): Promise<T> {
    const requestUserProject = new RequestHelper(
      USER_PROJECT_API_DATA_APLICATION_URL,
      METHOD_HTTP.GET,
      RESPONSE_TYPE.JSON,
      null,
      params
    )
    requestUserProject.addHeaders('Content-Type', 'application/json')
    requestUserProject.addHeaders('Authorization', `Bearer ${this.token()}`)
    const userProject = await requestUserProject.buildRequest<T>()
    return userProject
  }

  post!: <T>() => Promise<T>
  put!: <T>() => Promise<T>
  patch!: <T>() => Promise<T>
  delete!: <T>() => Promise<T>
  head!: <T>() => Promise<T>
}
export { LoginUtils }
