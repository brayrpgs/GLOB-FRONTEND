import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  IonAvatar,
  IonPopover,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonModal,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButtons,
  IonAlert,
  IonSpinner,
  IonToast,
  IonSelect,
  IonSelectOption
} from '@ionic/react'
import {
  createOutline,
  trashOutline,
  logOutOutline,
  closeOutline,
  cloudUploadOutline,
  eyeOffOutline,
  eyeOutline
} from 'ionicons/icons'
import styles from '../../styles/profile/styles.module.css'
import { UserUtils } from '../../utils/UserUtils'
import { TokenPayloadUtils } from '../../utils/TokenPayloadUtils'
import { User } from '../../models/User'
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../common/Validator'
import { TOKEN_KEY_NAME, PAYMENT_INFO_KEY_NAME } from '../../common/Common'

// Utils instances
const userUtils = new UserUtils()
const tokenPayloadUtils = new TokenPayloadUtils()

// Payment info type
interface PaymentInfo {
  userId?: number,
  method?: string
  lastFourDigits?: number
  status?: number
  nextPaymentDate?: string
  cardNumber?: string
  cardHolder?: string
  expiryDate?: string
  cvv?: string
  paypalEmail?: string
  paypalName?: string
}

// User Profile Component
const Component: React.FC = () => {
  // State variables
  const [user, setUser] = useState<User>()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [showLogoutAlert, setShowLogoutAlert] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<User> & { PASSWORD?: string }>({})
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({})
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [toast, setToast] = useState({
    message: '',
    show: false,
    color: 'danger' as 'danger' | 'success'
  })

  // Ref for avatar trigger
  const avatarButtonRef = useRef<HTMLIonAvatarElement>(null)

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const data = await userUtils.get<User>({
        user_id: tokenPayloadUtils.getTokenPayload().id
      })
      const fetchedUser = Array.isArray(data) ? data[0] : data
      setUser(fetchedUser)
      setFormData(fetchedUser)

      // Load saved payment info if exists
      const savedPaymentInfo = localStorage.getItem(PAYMENT_INFO_KEY_NAME)
      if (savedPaymentInfo) {
        const parsedPaymentInfo: PaymentInfo = JSON.parse(savedPaymentInfo)

        if (parsedPaymentInfo.userId === data.USER_ID) {
          setPaymentInfo(parsedPaymentInfo)
        }
      }
    }
    fetchUser()

    return () => { setFormData({}) }
  }, [])

  // Show toast message
  const showToast = useCallback(
    (message: string, color: 'danger' | 'success' = 'danger') => {
      setToast({ message, show: true, color })
    },
    []
  )

  // Validate form data before submit
  const validateData = useCallback(() => {
    const { EMAIL, USERNAME, PASSWORD } = formData

    // Required fields
    if (!EMAIL || !USERNAME) {
      showToast('Please fill in all required fields')
      return false
    }

    // EMAIL format basic check 
    if (EMAIL && typeof EMAIL === 'string') {
      if (!EMAIL_REGEX.test(EMAIL.trim())) {
        showToast('Please enter a valid email address.')
        return false
      }
    }

    // Password rules 
    if (PASSWORD) {
      if (PASSWORD.length < 8 || PASSWORD.length > 128) {
        showToast('Password must be between 8-128 characters.')
        return false
      }
      if (!PASSWORD_REGEX.test(PASSWORD)) {
        showToast('Password must contain at least one uppercase letter, one number, and one special character.')
        return false
      }
      if (PASSWORD !== confirmPassword) {
        showToast('Passwords do not match')
        return false
      }
    }

    if (paymentInfo.method === 'card') {
      const cardNumberDigits = (paymentInfo.cardNumber ?? '').replace(/\s+/g, '')

      // Card number must be numeric and between 13 and 19 digits
      if (!/^\d{13,19}$/.test(cardNumberDigits)) {
        showToast('Card number must be between 13 and 19 digits.')
        return false
      }

      // Cardholder name cannot be empty
      if (!paymentInfo.cardHolder || !paymentInfo.cardHolder.trim()) {
        showToast('Cardholder name is required.')
        return false
      }

      // Expiry date format validation (MM/YY)
      const expiry = paymentInfo.expiryDate ?? ''
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        showToast('Expiry date must be in MM/YY format.')
        return false
      }

      const [monthStr, yearStr] = expiry.split('/')
      const month = parseInt(monthStr, 10)
      const yy = parseInt(yearStr, 10)
      if (Number.isNaN(month) || Number.isNaN(yy)) {
        showToast('Expiry date is invalid.')
        return false
      }
      const fullYear = 2000 + yy

      // Validate month range
      if (month < 1 || month > 12) {
        showToast('Enter a valid expiry month.')
        return false
      }

      // Validate that expiry year is within a reasonable future window
      const now = new Date()
      const currentYear = now.getFullYear()
      const maxYear = currentYear + 20
      if (fullYear < currentYear || fullYear > maxYear) {
        showToast(`Expiry year must be between ${currentYear} and ${maxYear}.`)
        return false
      }

      // Create an expiry moment
      const expiryLastDay = new Date(fullYear, month, 0, 23, 59, 59, 999)

      // If expiry is in the past, reject
      if (expiryLastDay < now) {
        showToast('Card has expired.')
        return false
      }

      // CVV validation: 3 or 4 digits only
      if (!/^\d{3,4}$/.test(paymentInfo.cvv ?? '')) {
        showToast('CVV must be 3 or 4 digits.')
        return false
      }
    }

    if (paymentInfo.method === 'paypal') {
      const paypalEmail = (paymentInfo.paypalEmail ?? '').trim().toLowerCase()
      const paypalName = (paymentInfo.paypalName ?? '').trim()

      if (!paypalEmail || !EMAIL_REGEX.test(paypalEmail)) {
        showToast('Please enter a valid PayPal email.')
        return false
      }

      if (!paypalName) {
        showToast('PayPal account name is required.')
        return false
      }
    }

    return true
  }, [formData, paymentInfo, confirmPassword, showToast])

  // Handle close modal
  const handleCloseForm = useCallback(() => {
    setShowEditModal(false)
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
  }, [showEditModal, showConfirmPassword, showPassword, showConfirmPassword])

  // Handle general form changes
  const handleChange = useCallback((key: keyof (User & { PASSWORD?: string }), value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }, [formData])

  // Format card number: keep only digits and add a space every 4 digits
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim()
  }

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const clean = value.replace(/\D/g, '')
    if (clean.length === 0) return ''
    if (clean.length <= 2) return clean
    return clean.substring(0, 2) + '/' + clean.substring(2, 4)
  }

  // Update payment info with auto-formatting depending on the field
  const handlePaymentChange = useCallback((key: keyof PaymentInfo, value: string) => {
    let formattedValue = value ?? ''

    if (key === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (key === 'expiryDate') {
      formattedValue = formatExpiryDate(value)
    } else if (key === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4)
    } else if (key === 'paypalEmail') {
      formattedValue = value.trim().toLowerCase()
    } else if (key === 'paypalName') {
      formattedValue = value.trim()
    }

    setPaymentInfo(prev => ({ ...prev, [key]: formattedValue }))
  }, [])

  // Handle avatar upload and preview
  const handleAvatarUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setFormData({ ...formData, AVATAR_URL: reader.result as string })
    reader.readAsDataURL(file)
  }, [formData])

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!user) return
    if (!validateData()) return

    setLoading(true)
    try {
      // Combine user and payment info data
      const allUserData = {
        ...formData,
        ...(formData.AVATAR_URL ? { AVATAR_URL: formData.AVATAR_URL } : {}),
        ...paymentInfo
      }

      const dataCopy = { ...allUserData } as Record<string, any>;
      Object.keys(dataCopy).forEach(key => {
        if (dataCopy[key] == null) delete dataCopy[key];
      });

      let lastFourDigits = undefined
      if (paymentInfo.cardNumber) {
        const digits = paymentInfo.cardNumber.replace(/\D/g, '')
        lastFourDigits = digits.slice(-4)
      }

      const today = new Date()
      const nextPaymentDate = new Date(today.setMonth(today.getMonth() + 1))
        .toISOString()
        .split('T')[0]

      // Build PUT body with required payment fields
      const body = {
        ...Object.fromEntries(
          Object.entries(dataCopy).map(([key, value]) => [
            key.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
            value
          ])
        ),
        payment: {
          method: paymentInfo.method,
          lastFourDigits: lastFourDigits,
          status: 1,
          nextPaymentDate: nextPaymentDate
        }
      }

      // Update user data
      await userUtils.put<User>(body, user.USER_ID)
      setUser(prev => ({ ...prev, ...formData } as User))

      // Save payment info locally
      const resolvedPaymentInfo: PaymentInfo = { ...paymentInfo, userId: user.USER_ID }
      localStorage.setItem(PAYMENT_INFO_KEY_NAME, JSON.stringify(resolvedPaymentInfo))

      showToast('User updated successfully!', 'success')
      setTimeout(() => handleCloseForm(), 1500)
    } catch (error) {
      console.error('Error updating user:', error)
      showToast('Error updating user.', 'danger')
    } finally {
      setLoading(false)
    }
  }, [user, formData, paymentInfo, validateData, showToast, handleCloseForm])

  // Handle account deletion
  const handleDeleteAccount = useCallback(async () => {
    if (!user) return
    try {
      await userUtils.delete<User>(user.USER_ID)
      showToast('Account deleted successfully!', 'success')
      localStorage.setItem(TOKEN_KEY_NAME, '')
      localStorage.setItem(PAYMENT_INFO_KEY_NAME, '')
      history.pushState(null, '', '/login')
      history.go()
    } catch (error) {
      console.error('Error deleting account:', error)
      showToast('Something went wrong. Please try again later.', 'danger')
    }
  }, [user, showToast])

  // Handle user logout
  const handleLogout = useCallback(() => {
    localStorage.setItem(TOKEN_KEY_NAME, '')
    history.pushState(null, '', '/login')
    history.go()
  }, [])

  return (
    <>
      {/* Toast notification */}
      <IonToast
        isOpen={toast.show}
        onDidDismiss={() => setToast(prev => ({ ...prev, show: false }))}
        message={toast.message}
        duration={1850}
        color={toast.color}
        position='bottom'
      />

      {/* User avatar trigger */}
      <IonAvatar
        id='trigger-button'
        ref={avatarButtonRef}
        className={styles.profileComponent}
        onClick={() => setPopoverOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        <img
          alt='User avatar'
          src={user?.AVATAR_URL || 'https://ionicframework.com/docs/img/demos/avatar.svg'}
        />
      </IonAvatar>

      {/* Popover menu */}
      <IonPopover
        trigger='trigger-button'
        isOpen={popoverOpen}
        onDidDismiss={() => setPopoverOpen(false)}
        showBackdrop={true}
      >
        <IonList>
          <IonItem
            button
            onClick={() => {
              setPopoverOpen(false)
              setShowEditModal(true)
            }}
          >
            <IonIcon icon={createOutline} slot='start' />
            <IonLabel>Edit Account Info</IonLabel>
          </IonItem>

          <IonItem
            button
            onClick={() => {
              setPopoverOpen(false)
              setShowDeleteAlert(true)
            }}
          >
            <IonIcon icon={trashOutline} slot='start' color='danger' />
            <IonLabel color='danger'>Delete Account</IonLabel>
          </IonItem>

          <IonItem
            button
            onClick={() => {
              setPopoverOpen(false)
              setShowLogoutAlert(true)
            }}
          >
            <IonIcon icon={logOutOutline} slot='start' />
            <IonLabel>Log Out</IonLabel>
          </IonItem>
        </IonList>
      </IonPopover>

      {/* Edit user modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => handleCloseForm()}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Edit Account Info</IonTitle>
            <IonButtons slot='end'>
              <IonButton onClick={() => handleCloseForm()}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className='ion-padding'>
          {/* Avatar uploader */}
          <div
            className={styles['avatar-circle']}
            onClick={() => document.getElementById('avatarInput')?.click()}
            style={formData.AVATAR_URL ? { backgroundImage: `url(${formData.AVATAR_URL})` } : {}}
          >
            {formData.AVATAR_URL && (
              <IonIcon icon={cloudUploadOutline} className={styles['avatar-icon']} />
            )}
          </div>

          <input
            id='avatarInput'
            type='file'
            accept='image/*'
            onChange={handleAvatarUpload}
            style={{ display: 'none' }}
          />

          {/* General Information */}
          <h5 className='ion-margin-top ion-margin-bottom'>General Information</h5>

          <IonInput
            label='Email'
            labelPlacement='floating'
            fill='outline'
            className='ion-margin-vertical'
            value={formData.EMAIL}
            onIonChange={e => handleChange('EMAIL', e.detail.value!)}
          />

          <IonInput
            label='Username'
            labelPlacement='floating'
            fill='outline'
            className='ion-margin-vertical'
            value={formData.USERNAME}
            onIonChange={e => handleChange('USERNAME', e.detail.value!)}
          />

          <div className={styles['password-wrapper']}>
            <IonInput
              label='Password'
              labelPlacement='floating'
              fill='outline'
              type={showPassword ? 'text' : 'password'}
              className='ion-margin-vertical'
              onIonChange={e => handleChange('PASSWORD', e.detail.value!)}
            />
            <IonIcon
              icon={showPassword ? eyeOffOutline : eyeOutline}
              onClick={() => setShowPassword(prev => !prev)}
              className={styles['password-icon']}
            />
          </div>

          <div className={styles['password-wrapper']}>
            <IonInput
              label='Confirm Password'
              labelPlacement='floating'
              fill='outline'
              type={showConfirmPassword ? 'text' : 'password'}
              className='ion-margin-vertical'
              value={confirmPassword}
              onIonChange={e => setConfirmPassword(e.detail.value!)}
            />
            <IonIcon
              icon={showConfirmPassword ? eyeOffOutline : eyeOutline}
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className={styles['password-icon']}
            />
          </div>

          {/* Payment Information */}
          <h5 className='ion-margin-top ion-margin-bottom'>Payment Information</h5>

          <IonSelect
            label='Payment Method'
            labelPlacement='floating'
            fill='outline'
            value={paymentInfo.method || ''}
            onIonChange={e => handlePaymentChange('method', e.detail.value)}
            className='ion-margin-vertical'
          >
            <IonSelectOption value='card'>Credit / Debit Card</IonSelectOption>
            <IonSelectOption value='paypal'>PayPal</IonSelectOption>
          </IonSelect>

          {/* Conditional fields based on payment method */}
          {paymentInfo.method === 'card' && (
            <>
              {/* Card number input with auto-format */}
              <IonInput
                label='Card Number'
                labelPlacement='floating'
                fill='outline'
                type='text'
                inputmode='numeric'
                placeholder='1234 5678 9012 3456'
                value={paymentInfo.cardNumber ?? ''}
                onIonInput={e => handlePaymentChange('cardNumber', e.detail.value!)}
                maxlength={23} // 19 digits + 4 spaces
                className='ion-margin-vertical'
              />

              {/* Cardholder name input */}
              <IonInput
                label='Cardholder Name'
                labelPlacement='floating'
                fill='outline'
                type='text'
                value={paymentInfo.cardHolder ?? ''}
                onIonInput={e => handlePaymentChange('cardHolder', e.detail.value!)}
                className='ion-margin-vertical'
              />

              {/* Expiry date and CVV side-by-side */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <IonInput
                  label='Expiry Date'
                  labelPlacement='floating'
                  fill='outline'
                  type='text'
                  inputmode='numeric'
                  placeholder='MM/YY'
                  value={paymentInfo.expiryDate ?? ''}
                  onIonInput={e => handlePaymentChange('expiryDate', e.detail.value!)}
                  maxlength={5}
                  style={{ flex: 1 }}
                />

                <IonInput
                  label='CVV'
                  labelPlacement='floating'
                  fill='outline'
                  type='password'
                  inputmode='numeric'
                  placeholder='123'
                  value={paymentInfo.cvv ?? ''}
                  onIonInput={e => handlePaymentChange('cvv', e.detail.value!)}
                  maxlength={4}
                  style={{ flex: 1 }}
                />
              </div>
            </>
          )}

          {paymentInfo.method === 'paypal' && (
            <>
              <IonInput
                label='PayPal email'
                labelPlacement='floating'
                fill='outline'
                type='email'
                value={paymentInfo.paypalEmail ?? ''}
                onIonChange={e => handlePaymentChange('paypalEmail', e.detail.value!)}
                className='ion-margin-vertical'
              />

              <IonInput
                label='PayPal account name'
                labelPlacement='floating'
                fill='outline'
                type='text'
                value={paymentInfo.paypalName ?? ''}
                onIonChange={e => handlePaymentChange('paypalName', e.detail.value!)}
                className='ion-margin-vertical'
              />
            </>
          )}

          {/* Submit button */}
          <IonButton
            expand='block'
            onClick={handleSubmit}
            disabled={loading}
            className='ion-margin-top'
          >
            {loading ? <IonSpinner name='crescent' /> : 'Save Changes'}
          </IonButton>
        </IonContent>
      </IonModal>

      {/* Confirm delete account alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        header='Delete Account'
        message='Are you sure you want to delete your account? This action cannot be undone.'
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: 'Delete', role: 'destructive', handler: handleDeleteAccount }
        ]}
        onDidDismiss={() => setShowDeleteAlert(false)}
      />

      {/* Confirm logout alert */}
      <IonAlert
        isOpen={showLogoutAlert}
        header='Log Out'
        message='Do you really want to log out?'
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: 'Log Out', handler: handleLogout }
        ]}
        onDidDismiss={() => setShowLogoutAlert(false)}
      />
    </>
  )
}

export { Component }
