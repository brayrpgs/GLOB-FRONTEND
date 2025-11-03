import React, { useRef, useState, useEffect } from 'react'
import { IonToast, IonSpinner } from '@ionic/react'
import styles from '../../styles/login/styles.module.css'
import { EMAIL_REGEX } from '../../common/Validator'
import { RecoverPasswordUtils } from '../../utils/RecoverPasswordUtils'
import { RecoverPassword as RecoverPass } from '../../models/RecoverPassword'
import { ValidateRecoverPassword } from '../../middleware/ValidateRecoverPassword'

// Props for RecoverPassword component
interface RecoverPasswordProps {
  isOpen: boolean
  onClose: () => void
}

// RecoverPassword Component
const RecoverPassword: React.FC<RecoverPasswordProps> = ({ isOpen, onClose }) => {
  // Refs and state variables
  const emailRef = useRef<HTMLInputElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Toast state
  const [toast, setToast] = useState({
    id: '',
    message: '',
    color: 'success' as 'success' | 'danger',
    show: false
  })

  // Modal visibility state
  const [visible, setVisible] = useState(false)
  const [showClass, setShowClass] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Handle modal open/close with animation
  useEffect(() => {
    if (isOpen) {
      setToast({ id: '', message: '', color: 'success', show: false })
      setVisible(true)
      setTimeout(() => setShowClass(true), 10)
    } else {
      setShowClass(false)
      if (closeTimeoutRef.current != null) clearTimeout(closeTimeoutRef.current)
      const timer = setTimeout(() => setVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Show toast message
  const showToast = (message: string, color: 'success' | 'danger'): void => {
    setToast(prev => ({ ...prev, show: false }))
    setTimeout(() => {
      setToast({
        id: crypto.randomUUID(),
        message,
        color,
        show: true
      })
    }, 50)
  }

  // Handle sending password recovery email
  const handleSend = async (): Promise<void> => {
    const email = emailRef.current?.value

    if (email === null || !EMAIL_REGEX.test(email as string)) {
      showToast('Please enter a valid email', 'danger')
      return
    }

    setIsLoading(true)

    // API call to send recovery email
    try {
      await new RecoverPasswordUtils().post<RecoverPass>({
        email
      })
      showToast('Password reset email sent!', 'success')
      setTimeout(() => {
        new ValidateRecoverPassword('/reset').redirect()
      }, 1000)
    } catch (error) {
      showToast('Error, please try again later', 'danger')
    } finally {
      setIsLoading(false)
    }
  }

  if (!visible) return null

  return (
    <>
      <div
        className={`${styles['modal-backdrop']} ${showClass ? styles.show : ''}`}
        onClick={onClose}
      >
        <div className={styles['modal-box']} onClick={(e) => e.stopPropagation()}>
          <h2>Recover Password</h2>
          <input type='email' placeholder='Email' ref={emailRef} />

          <button onClick={handleSend} disabled={isLoading}>
            {isLoading ? <IonSpinner name='crescent' /> : 'Send'}
          </button>
        </div>
      </div>

      <IonToast
        key={toast.id}
        isOpen={toast.show}
        onDidDismiss={() => setToast(prev => ({ ...prev, show: false }))}
        message={toast.message}
        duration={2000}
        color={toast.color}
        position='bottom'
      />
    </>
  )
}

export { RecoverPassword }
