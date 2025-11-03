import { Validate } from './Validate'

class ValidateMain extends Validate {
  async validateWithLogin (): Promise<void> {
    throw new Error('Method not implemented.')
  }

  validateFields (data: Record<number, string>): boolean {
    let result = data[0].length > 0
    result = result && data[1].length > 0
    result = result && (new Date(data[2]) < new Date(data[3]))
    return result
  }
}
export { ValidateMain }
