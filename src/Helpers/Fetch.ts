export const FETCH = async <T>(url: string = URL, options?: RequestInit): Promise<T> => {
  const init: RequestInit = { method: methods.GET, ...options }
  const response = await fetch(url, init)
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Network response was not ok: ${response.status} ${response.statusText} ${text}`)
  }
  const data = (await response.json()) as T
  return data
}
const fetchData = async () => {
  const data = await FETCH<Root>()
}

enum methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

interface Root {
  Issue_type: IssueType[]
  page: number
  currentLimit: number
  totalData: number
}

interface IssueType {
  ISSUE_TYPE_ID: number
  STATUS: number
  PRIORITY: number
}

export type { IssueType, Root }
