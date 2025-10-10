import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import { logoIonic } from 'ionicons/icons'
import styles from '../../styles/error/styles.module.css'
const Page: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Page Not Found</IonTitle>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/' />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <p className={styles['error-code']}>404 <span><IonIcon className={styles.icon} icon={logoIonic} /></span></p>
        <IonButton routerLink='/' color='danger'>
          Go to Homepage
        </IonButton>
        <p>
          We regret to inform you that the requested page could not be located.
          It may have been moved, renamed, or is temporarily unavailable.
          Please verify the URL or return to the homepage for further navigation.
        </p>
      </IonContent>
    </IonPage>
  )
}
export { Page }
