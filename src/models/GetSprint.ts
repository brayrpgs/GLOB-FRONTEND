import { Sprint } from './Sprint'

export interface GetSprint {
  data: Sprint[]
  page: number
  currentLimit: number
  totalData: number
}
