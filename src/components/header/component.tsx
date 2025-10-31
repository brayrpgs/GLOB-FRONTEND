import { IonButton, IonHeader, IonTitle, IonToolbar } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import styles from '../../styles/header/styles.module.css'
import { Component as Profile } from '../profile/component'
import { ImportData as Import } from '../import/ImportData'
import { AIFeedbackModal as Ai } from '../aifeedback/AIFeedbackModal'
import { component as Notifications } from '../notifications/component'
import { ValidateHeader } from '../../middleware/ValidateHeader'

interface HeaderProps {
  isLoggedIn?: boolean
}

const component: React.FC<HeaderProps> = ({ isLoggedIn }) => {
  const validate = new ValidateHeader()
  const [proUser, setProUser] = useState<boolean>(false)

  useEffect(() => {
    const exec = async (): Promise<void> => {
      const isProUser = await validate.isProUser()
      setProUser(isProUser)
    }
    void exec()
  }, [])
  return (
    <IonHeader translucent collapse='fade'>
      <IonToolbar>
        <IonTitle>
          <div className={styles.headerContent}>
            <IonButton routerLink='/' className={`${styles.headerTitle} ${styles.textSize}`} color='secondary'>Quick Report</IonButton>
            <IonButton routerLink='/contact' className={`${styles.headerTitle} ${styles.textSize}`} color='secondary'>Contact Us</IonButton>

            {isLoggedIn as boolean
              ? (
                <>
                  <Import />
                  <Ai projectId={1} />
                  {
                    proUser ? (<Notifications />) : (<div />)
                  }
                  <Profile />
                </>
                )
              : (
                <div>
                  <IonButton routerLink='/login' className={`${styles.headerLink} ${styles.textSize}`} color='dark'>Login</IonButton>
                  <IonButton routerLink='/register' className={`${styles.headerLink} ${styles.textSize}`} color='dark'>Sign Up</IonButton>
                </div>
                )}
          </div>
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}

export { component }
