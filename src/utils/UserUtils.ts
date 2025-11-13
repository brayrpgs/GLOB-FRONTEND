import { MEMBERSHIP_API_DATA_APLICATION_URL, TOKEN_KEY_NAME, USER_API_SECURITY_URL } from '../common/Common'
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

  async post<T>(body?: any): Promise<T> {
    const request = new RequestHelper(
      USER_API_SECURITY_URL,
      METHOD_HTTP.POST,
      RESPONSE_TYPE.JSON,
      body
    )
    request.addHeaders('Content-Type', 'application/json')
    request.addHeaders('Accept', 'application/json')
    return await request.buildRequest<T>()
  }

  async put<T>(body?: any, path?: any): Promise<T> {
    const request = new RequestHelper(
      `${USER_API_SECURITY_URL}/${path as number}`,
      METHOD_HTTP.PUT,
      RESPONSE_TYPE.JSON,
      body
    )
    request.addHeaders('Content-Type', 'application/json')
    return await request.buildRequest()
  }

  async delete<T>(path?: any): Promise<T> {
    const request = new RequestHelper(
      `${USER_API_SECURITY_URL}/${path as number}`,
      METHOD_HTTP.DELETE,
      RESPONSE_TYPE.JSON,
      null,
      null
    )
    request.addHeaders('Content-Type', 'application/json')
    return await request.buildRequest<T>()
  }

<<<<<<< HEAD
  patch!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
=======
  async patch<T>(body: any, path: any): Promise<T> {
    const request = new RequestHelper(
      `${MEMBERSHIP_API_DATA_APLICATION_URL}${path as number}`,
      METHOD_HTTP.PATCH,
      RESPONSE_TYPE.JSON,
      body
    )
    request.addHeaders('Content-Type', 'application/json')
    request.addHeaders('Accept', 'application/json')
    request.addHeaders('Authorization', this.token())
    return await request.buildRequest<T>()
  }

>>>>>>> 4a6a233056c80915a248655c6789bf8542a5ce48
  head!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
}
export { UserUtils }
