class URLHelper {
  private readonly path: string
  private readonly url: string

  constructor () {
    this.path = window.location.pathname
    this.url = window.location.href
  }

  getPath (): string {
    return this.path
  }

  getPathId (): number {
    const id = this.getPath().split('/').reverse()[0]
    return Number.parseInt(id)
  }

  getUrl (): URL {
    const uri: URL = new URL(this.url)
    return uri
  }

  getQueryParams (): URLSearchParams {
    return this.getUrl().searchParams
  }
}
export { URLHelper }
