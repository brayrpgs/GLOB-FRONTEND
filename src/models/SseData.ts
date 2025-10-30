interface SSEData {
  channel: string
  data: Record<string, any>
  table: string
  operation: string
  id: string
  message: string
  timestamp: string
}

export type { SSEData }
