import { CSV_API_IMPORT_EXPORT_URL, TOKEN_KEY_NAME } from '../common/Common'
import { METHOD_HTTP, RESPONSE_TYPE } from '../Helpers/FetchHelper'
import { RequestHelper } from '../Helpers/RequestHelper'
import { Api } from '../interfaces/Api'
import { TokenPayload } from '../models/TokenPayload'

class ImportDataUtils implements Api {
  get!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  async post<T>(body?: any): Promise<T> {
    const requestUpload = new RequestHelper(
      CSV_API_IMPORT_EXPORT_URL,
      METHOD_HTTP.POST,
      RESPONSE_TYPE.JSON,
      body,
      null
    )
    requestUpload.addHeaders('Content-Type', 'application/json')
    requestUpload.addHeaders('Authorization', `Bearer ${this.token()}`)
    return await requestUpload.buildRequest<T>()
  }

  put!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  patch!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  delete!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  head!: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  token (): string { return localStorage.getItem(TOKEN_KEY_NAME) as string }
}

export { ImportDataUtils }
