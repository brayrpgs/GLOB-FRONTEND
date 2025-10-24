import { FetchHelper, METHOD_HTTP, RESPONSE_TYPE } from './FetchHelper'

class RequestHelper {
  private fetch: FetchHelper | null
  private readonly url: string
  private readonly method: METHOD_HTTP
  private headers: Headers | null
  private readonly body?: any
  private readonly responseType: RESPONSE_TYPE
  private readonly parameters: URLSearchParams

  constructor (url: string, method: METHOD_HTTP, responseType: RESPONSE_TYPE = RESPONSE_TYPE.JSON, body?: any, params?: any) {
    this.url = url
    this.method = method
    this.headers = null
    this.fetch = null
    this.body = body
    this.responseType = responseType
    this.parameters = new URLSearchParams(params)
  }

  addHeaders (key: string, value: string): void {
    this.headers ??= new Headers()
    this.headers.append(key, value)
  }

  cleanHeaders (): void {
    this.headers = null
    this.headers = new Headers()
  }

  async buildRequest<T>(): Promise<T> {
    this.fetch = new FetchHelper(`${this.url}?${this.parameters.toString()}`, this.method, this.headers as Headers, this.body)
    return await this.fetch.buildFetch<T>(this.responseType)
  }
}
export { RequestHelper }
