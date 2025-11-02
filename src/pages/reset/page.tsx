import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react'
import {
  IonPage,
  IonContent,
  IonButton,
  IonToast,
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle
} from '@ionic/react'
import styles from '../../styles/reset/styles.module.css'
import { VALIDATE_API_SECURITY_URL } from '../../common/Common'
import { OTP_REGEX } from '../../common/Validator'
import { ChangePassword } from '../../components/recover/ChangePassword'

const OTP_LENGTH = 6

// Reset Page Component
const Page: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [isVerifying, setIsVerifying] = useState(false)
  const [toast, setToast] = useState({
    id: '',
    message: '',
    show: false,
    color: 'danger' as 'danger' | 'success'
  })
  const [autoFillDone, setAutoFillDone] = useState(false)
  const [otpValidated, setOtpValidated] = useState(false)
  const [recoverId, setRecoverId] = useState<string | null>(null)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  // Show toast
  const showToast = (message: string, color: 'success' | 'danger'): void => {
    setToast({
      id: crypto.randomUUID(),
      message,
      show: true,
      color
    })
  }

  // Verify OTP
  const handleVerify = async (): Promise<void> => {
    if (otp.some(d => d === '')) {
      showToast('Please complete the OTP', 'danger')
      return
    }

    const code = otp.join('')
    setIsVerifying(true)

    // Call API to validate OTP
    try {
      const response = await fetch(VALIDATE_API_SECURITY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: code })
      })

      if (response.ok) {
        const result = await response.json()
        const recoverId = result.data[0].USER_ID
        setRecoverId(recoverId)
        setOtpValidated(true)
        showToast('OTP verified successfully!', 'success')
      } else {
        showToast('Invalid or expired token', 'danger')
      }
    } catch (error) {
      console.error(error)
      showToast('Network error, please try again later', 'danger')
    } finally {
      setIsVerifying(false)
    }
  }

  // Auto-fill from URL param
  const fillOtpDigit = (digits: string[], index = 0): void => {
    if (index >= digits.length) {
      setAutoFillDone(true)
      return
    }

    setOtp(prev => {
      const newOtp = [...prev]
      newOtp[index] = digits[index]
      return newOtp
    })

    inputRefs.current?.[index]?.focus()
    setTimeout(() => fillOtpDigit(digits, index + 1), 150)
  }

  // On mount, check URL for OTP param
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const otpParam = urlParams.get('otp')
    if (otpParam !== null && /^[0-9]{6}$/.test(otpParam)) {
      fillOtpDigit(otpParam.split(''))
    }
  }, [])

  // If all digits filled, verify OTP
  useEffect(() => {
    if (!autoFillDone && otp.every(d => d !== '')) {
      const exec = async (): Promise<void> => {
        await handleVerify()
      }
      void exec()
    }
  }, [otp, autoFillDone])

  // Change handler
  const handleChange = (index: number, value: string): void => {
    if (value !== '' && !OTP_REGEX.test(value)) return

    setOtp(prev => {
      const newOtp = [...prev]
      newOtp[index] = value
      return newOtp
    })

    // Move to next input
    if (value !== null && index < OTP_LENGTH - 1) {
      inputRefs.current?.[index + 1]?.focus()
    }
  }

  // Backspace handler
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && otp[index] !== null && index > 0) {
      const prevIndex = index - 1
      inputRefs.current?.[prevIndex]?.focus()
      setOtp(prev => {
        const newOtp = [...prev]
        newOtp[prevIndex] = ''
        return newOtp
      })
    }
  }

  // Paste
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').slice(0, OTP_LENGTH)
    if (!/^[0-9]+$/.test(pastedData)) return

    setOtp(prev => {
      const newOtp = [...prev]
      pastedData.split('').forEach((char, i) => {
        if (i < OTP_LENGTH) newOtp[i] = char
      })
      return newOtp
    })

    const nextIndex = Math.min(pastedData.length - 1, OTP_LENGTH - 1)
    inputRefs.current?.[nextIndex]?.focus()
  }

  // Render component
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/login' text='' />
          </IonButtons>
          <IonTitle className={styles['reset-title']}>Recover Password</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonToast
          key={toast.id}
          isOpen={toast.show}
          onDidDismiss={() => setToast(prev => ({ ...prev, show: false }))}
          message={toast.message}
          duration={2000}
          color={toast.color}
        />

        <div className={styles['otp-wrapper']}>
          {!otpValidated
            ? (
              <div className={styles['otp-card']}>
                <div
                  className={styles['otp-icon']}
                  style={{ background: 'linear-gradient(135deg, #4f46e5, #3b82f6)', color: '#fff', fontSize: '32px' }}
                >
                  OTP
                </div>

                <h2>One-Time Password</h2>
                <p>Enter the 6-digit code sent to your email</p>

                <div className={styles['otp-inputs']}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el }}
                      type='text'
                      inputMode='numeric'
                      maxLength={1}
                      value={digit}
                      onChange={e => handleChange(i, e.target.value)}
                      onKeyDown={e => handleKeyDown(i, e)}
                      onPaste={handlePaste}
                      className={styles['otp-box']}
                    />
                  ))}
                </div>

                <IonButton
                  expand='block'
                  className={styles['otp-button']}
                  onClick={handleVerify}
                  disabled={isVerifying}
                >
                  {isVerifying
                    ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <IonSpinner name='crescent' color='light' />
                        Validating...
                      </div>
                      )
                    : (
                        'Verify OTP'
                      )}
                </IonButton>
              </div>
              )
            : (
                recoverId !== null && (
                  <div className={styles['otp-card']}>
                    <ChangePassword recoverId={recoverId} />
                  </div>
                )
              )}
        </div>
      </IonContent>
    </IonPage>
  )
}

export { Page }
