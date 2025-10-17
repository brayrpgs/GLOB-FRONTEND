class FetchHelper {
  private readonly baseUrl: string
  private readonly method: METHOD_HTTP
  private readonly headers: Headers

  constructor (baseUrl: string, method: METHOD_HTTP, headers: Headers) {
    this.baseUrl = baseUrl
    this.method = method
    this.headers = headers
  }

  public async buildFetch<T>(): Promise<T> {
    // perform the fetch
    const response = await fetch(this.baseUrl, {
      method: this.method,
      headers: this.headers
    })
    // validate if response is client error
    if (response.status >= 400 && response.status < 600) {
      console.error(`Client error: ${response.status} ${response.statusText}`)
      return await Promise.reject(new Error(`Client error: ${response.status} ${response.statusText}`))
    }
    // get the response validate if is ok
    if (response.status >= 200 && response.status < 300) {
      console.log(`Success: ${response.status} ${response.statusText}`)
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

export { FetchHelper, METHOD_HTTP }
