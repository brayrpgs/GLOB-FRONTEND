import { IonButton, IonHeader, IonTitle, IonToolbar } from '@ionic/react'
import React from 'react'
import styles from '../../styles/header/styles.module.css'

const component: React.FC = () => {
  return (
    <IonHeader translucent collapse='fade'>
      <IonToolbar>
        <IonTitle>
          <div className={styles.headerContent}>
            <span className={styles.headerItems}>
              <IonButton routerLink='/' className={styles.headerTitle} color='secondary'>Quick Report</IonButton>
              <IonButton routerLink='/' className={styles.headerTitle} color='secondary'>Contact Us</IonButton>
            </span>
            <span className={styles.headerItems}>
              <IonButton routerLink='/login' className={styles.headerLink} color='dark'>Login</IonButton>
              <IonButton routerLink='/register' className={styles.headerLink} color='dark'>Sign Up</IonButton>
            </span>
          </div>
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}

export { component }
