import { IonContent, IonPage } from '@ionic/react'

const Page: React.FC = () => {
  return (
    <IonPage>
      <IonContent className='ion-padding'>
        <h1>Welcome</h1>
        <p>Welcome to our application! We're glad to have you here. Explore the features and enjoy your experience.</p>
      </IonContent>
    </IonPage>
  )
}

export { Page }
