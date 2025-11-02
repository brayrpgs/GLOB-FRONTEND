export interface OTP {
  valid: boolean
  data: OPT_INFO[]
}

export interface OPT_INFO {
  RECOVER_PASSWORD_ID: number
  USER_ID: number
  OTP: string
  IS_USED: number
  EXPIRY_DATE: string
}
