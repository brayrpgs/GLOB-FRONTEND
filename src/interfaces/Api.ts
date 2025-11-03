import { TokenPayload } from '../models/TokenPayload'

interface Api {
  token: () => string
  get: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  post: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  put: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  patch: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  delete: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
  head: <T>(tokenPayload?: TokenPayload, body?: any, params?: any, path?: any) => Promise<T>
}
export type { Api }
