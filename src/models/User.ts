import { MembershipPlan } from '../enums/MembershipPlan'

export interface User {
  USER_ID: number
  EMAIL: string
  USERNAME: string
  AVATAR_URL: string
  STATUS: number
  MEMBERSHIPPLAN_ID: MembershipPlan
  MEMBERSHIP_PLAN_NAME: any
}
