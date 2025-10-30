import { IonButton, IonHeader, IonTitle, IonToolbar } from '@ionic/react'
import React from 'react'
import styles from '../../styles/header/styles.module.css'
import { Component as Profile } from '../profile/component'
import { ImportData as Import } from '../import/ImportData'
import { AIFeedbackModal as Ai } from '../aifeedback/AIFeedbackModal'
import { component as Notifications } from '../notifications/component'

interface HeaderProps {
  isLoggedIn?: boolean
}

const component: React.FC<HeaderProps> = ({ isLoggedIn }) => {
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
                  <Notifications />
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
