import { QUERY_PROJECT_BY_AI_URL, TOKEN_KEY_NAME } from '../common/Common'
import { METHOD_HTTP } from '../Helpers/FetchHelper'
import { Api } from '../interfaces/Api'

export class QueryAIUtils implements Api {
  token(): string {
    return localStorage.getItem(TOKEN_KEY_NAME) as string
  }

  async stream(
    projectId: number,
    userQuery: string,
    onChunk: (chunk: string, done: boolean) => void,
    onComplete?: (fullResponse: string) => void,
    onAbort?: () => void,
    abortControllerRef?: React.RefObject<AbortController | null>
  ): Promise<void> {
    // Cancel previous stream if any
    if (abortControllerRef?.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    if (abortControllerRef) abortControllerRef.current = controller

    try {
      const response = await fetch(`${QUERY_PROJECT_BY_AI_URL}/${projectId}`, {
        method: METHOD_HTTP.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery }),
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('No response body received.')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let rawText = ''
      let done = false

      while (!done) {
        const { value, done: chunkDone } = await reader.read()
        done = !!chunkDone
        const chunk = decoder.decode(value || new Uint8Array(), { stream: !done })
        rawText += chunk
        onChunk(rawText, done)
      }

      if (onComplete) onComplete(rawText)
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        console.log('Request cancelled by user.')
        if (onAbort) onAbort()
        return
      }
      console.error('QueryAIUtils stream error:', err)
      throw err
    } finally {
      if (abortControllerRef) abortControllerRef.current = null
    }
  }

  // Other interface methods (not implemented)
  get!: <T>(path?: any) => Promise<T>
  post!: <T>(tokenPayload?: any, body?: any, params?: any, path?: any) => Promise<T>
  put!: <T>(tokenPayload?: any, body?: any, params?: any, path?: any) => Promise<T>
  patch!: <T>(tokenPayload?: any, body?: any, params?: any, path?: any) => Promise<T>
  delete!: <T>(tokenPayload?: any, body?: any, params?: any, path?: any) => Promise<T>
  head!: <T>(tokenPayload?: any, body?: any, params?: any, path?: any) => Promise<T>
}
