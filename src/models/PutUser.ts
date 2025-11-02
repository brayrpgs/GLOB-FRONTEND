export interface PutUser {
  email: string
  username: string
  password: string
  avatarUrl: string
  status: number
  paymentInfo?: PaymentInfo
}

export interface PaymentInfo {
  paymentInfoId: number
  method: string
  lastFourDigits: string
  status: number
  nextPaymentDate: string
}
