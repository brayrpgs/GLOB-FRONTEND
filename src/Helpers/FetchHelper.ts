class FetchHelper {
  private readonly baseUrl: string
  private readonly method: METHOD_HTTP
  private readonly headers: Headers
  private readonly body?: any

  constructor (baseUrl: string, method: METHOD_HTTP, headers: Headers, body?: any) {
    this.baseUrl = baseUrl
    this.method = method
    this.headers = headers
    this.body = body
  }

  public async buildFetch<T>(responseType: RESPONSE_TYPE = RESPONSE_TYPE.JSON): Promise<T> {
    // perform the fetch
    const response = await fetch(this.baseUrl, {
      method: this.method,
      headers: this.headers,
      body: this.body != null ? JSON.stringify(this.body) : null
    })
    // validate if response is client error
    if (response.status >= 400 && response.status < 600) {
      console.error(`FETCH_HELPER: ${response.status} ${response.statusText}`)
      return await Promise.reject(new Error(`FETCH_HELPER: ${response.status} ${response.statusText}`))
    }
    // get the response validate if is ok
    if (response.status >= 200 && response.status < 300) {
      console.log(`Success: ${response.status} ${response.statusText}`)
    }

    if (responseType === RESPONSE_TYPE.TEXT) {
      const text = await response.text()
      return text as T
    }
    // parse the response as json
    const data = (await response.json()) as T
    return data
  }
}

enum METHOD_HTTP {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  HEAD = 'HEAD'
}

enum RESPONSE_TYPE {
  JSON = 'json',
  TEXT = 'text'
}

export { FetchHelper, METHOD_HTTP, RESPONSE_TYPE }
