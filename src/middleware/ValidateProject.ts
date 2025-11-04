import { Validate } from './Validate'

class ValidateProject extends Validate {
  async validateWithLogin (): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
export { ValidateProject }
