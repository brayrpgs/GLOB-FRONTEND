import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react'

const Page: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Quick Report </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <h2>Welcome to Quick Report</h2>
        <IonButton routerLink='/error'>Go to Page Error</IonButton>
      </IonContent>
    </IonPage>
  )
}
export { Page }
