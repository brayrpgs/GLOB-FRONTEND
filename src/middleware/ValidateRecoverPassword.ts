import { Validate } from './Validate'

class ValidateRecoverPassword extends Validate {
  async validateWithLogin (): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
export { ValidateRecoverPassword }
