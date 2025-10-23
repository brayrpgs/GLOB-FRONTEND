import { IonButton, IonHeader, IonTitle, IonToolbar } from '@ionic/react'
import React from 'react'
import styles from '../../styles/header/styles.module.css'
import { Component as Profile } from "../profile/component";


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
            <IonButton routerLink='/' className={`${styles.headerTitle} ${styles.textSize}`} color='secondary'>Contact Us</IonButton>

            {isLoggedIn ? (
              <Profile />
            ) : (
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
