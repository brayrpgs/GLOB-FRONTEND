import { TOKEN_KEY_NAME } from '../common/Common'

abstract class Validate {
  protected route: string
  constructor (route: string = '/') {
    this.route = route
  }

  redirect (): void {
    history.pushState(null, '', this.route)
    history.go()
  }

  validateJWT (): void {
    // validate localstorage
    if (localStorage.getItem(TOKEN_KEY_NAME) === null) {
      this.redirect()
    }
  }

  abstract validateWithLogin (): Promise<void>
}

export { Validate }
