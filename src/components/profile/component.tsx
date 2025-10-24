import { IonButton, IonIcon } from '@ionic/react'
import { personCircle } from 'ionicons/icons'
import styles from '../../styles/profile/styles.module.css'

const Component: React.FC = () => {
  return (
    <IonButton color='dark' className={`${styles.profileComponent}`}>
      <IonIcon icon={personCircle} size='large' />
    </IonButton>
  )
}

export { Component }
