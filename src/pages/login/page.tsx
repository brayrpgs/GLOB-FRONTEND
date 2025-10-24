import React, { useRef, useState, useCallback } from 'react'
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonSpinner,
  IonToast,
  IonRouterLink
} from '@ionic/react'
import { LOGIN_API_SECURITY_URL, TOKEN_KEY_NAME } from '../../common/Common'
import { eyeOutline, eyeOffOutline } from 'ionicons/icons'
import styles from '../../styles/login/styles.module.css'
import { RecoverPassword } from '../../components/recover/RecoverPassword'
import { METHOD_HTTP, RESPONSE_TYPE } from '../../Helpers/FetchHelper'
import { TokenUtils } from '../../Helpers/TokenHelper'
import { TokenPayload } from '../../models/TokenPayload'
import { RequestHelper } from '../../Helpers/RequestHelper'

// Login Page Component
const Page: React.FC = () => {
  // Refs for input fields
  const emailRef = useRef<HTMLIonInputElement>(null)
  const passwordRef = useRef<HTMLIonInputElement>(null)

  // State variables
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recoverModalOpen, setRecoverModalOpen] = useState(false)
  const [toast, setToast] = useState({
    id: '',
    message: '',
    show: false,
    color: 'danger' as 'danger' | 'success'
  })

  // Validate input data
  const validateData = useCallback(() => {
    const email = (emailRef.current?.value as string) ?? ''
    const password = (passwordRef.current?.value as string) ?? ''

    // Basic validation
    if (email.trim() === '' || password.trim() === '') {
      showToast('Please fill in all required fields', 'danger')
      return false
    }
    return true
  }, [])

  // Show toast message
  const showToast = useCallback(
    (message: string, color: 'danger' | 'success' = 'danger') => {
      setToast({
        id: crypto.randomUUID(),
        message,
        show: true,
        color
      })
    },
    []
  )

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate data before submission
      if (!validateData()) return

      // Extract values
      const email = emailRef.current?.value as string
      const password = passwordRef.current?.value as string

      setLoading(true)

      // Make API call
      try {
        const body = { email: email.trim(), password: password.trim() }
        const requestLogin = new RequestHelper(
          LOGIN_API_SECURITY_URL,
          METHOD_HTTP.POST,
          RESPONSE_TYPE.TEXT,
          body,
          { data: 'test' }
        )
        requestLogin.addHeaders('Content-Type', 'application/json')
        const data = await requestLogin.buildRequest<string>()

        // Store token in local storage
        localStorage.setItem(TOKEN_KEY_NAME, data)

        // request if user have user_project registers
        const tokenUtils: TokenPayload = new TokenUtils(data).decode()

        showToast('Login successful!', 'success')

        // Redirect to main if user had user_project role if not redirect to welcome
        setTimeout(() => {
          history.pushState(null, '', '/home')
          history.go()
        }, 1000)
      } catch (error) {
        showToast('An unexpected error occurred, please try again later.', 'danger')
      } finally {
        setLoading(false)
      }
    },
    [validateData, showToast]
  )

  // Render component
  return (
    <IonPage>
      <IonContent fullscreen>
        <IonToast
          key={toast.id}
          isOpen={toast.show}
          onDidDismiss={() => setToast(prev => ({ ...prev, show: false }))}
          message={toast.message}
          duration={2500}
          color={toast.color}
          position='bottom'
        />

        <div className={styles['login-content']}>
          <IonGrid fixed>
            <IonRow className='ion-justify-content-center'>
              <IonCol size='12' sizeMd='6' sizeLg='4' className={styles['login-col']}>
                <h1 className={styles['login-title']}>Sign in</h1>

                <form onSubmit={handleSubmit}>
                  <IonInput
                    ref={emailRef}
                    fill='outline'
                    label='Email'
                    labelPlacement='floating'
                    type='email'
                    className={styles['login-input']}
                  />

                  <div className={styles['password-wrapper']}>
                    <IonInput
                      ref={passwordRef}
                      fill='outline'
                      label='Password'
                      labelPlacement='floating'
                      type={showPassword ? 'text' : 'password'}
                      className={styles['login-input']}
                    />
                    <IonIcon
                      icon={showPassword ? eyeOffOutline : eyeOutline}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={styles['password-icon']}
                    />
                  </div>

                  <IonButton
                    expand='block'
                    color='light'
                    className={styles['login-button']}
                    type='submit'
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name='crescent' color='dark' /> : 'Sign In'}
                  </IonButton>
                </form>

                <div className={styles['login-links']}>
                  <IonText color='medium'>
                    <a
                      href='#'
                      onClick={(e) => {
                        e.preventDefault()
                        setRecoverModalOpen(true)
                      }}
                    >
                      Forgot password?
                    </a>
                  </IonText>

                  <IonText color='primary'>
                    <IonRouterLink
                      routerLink='/register'
                      className={styles['login-links']}
                    >
                      Create New User
                    </IonRouterLink>
                  </IonText>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
        <RecoverPassword isOpen={recoverModalOpen} onClose={() => setRecoverModalOpen(false)} />
      </IonContent>
    </IonPage>
  )
}

export { Page }
