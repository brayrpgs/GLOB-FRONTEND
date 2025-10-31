import { IonAlert, IonButton, IonContent, IonIcon, IonPage } from '@ionic/react'
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'
import { ValidateHome } from '../../middleware/ValidateHome'
import { component as Project } from '../../components/project/component'
import { useEffect } from 'react'
import { addCircle } from 'ionicons/icons'

const Page: React.FC = () => {
  useEffect(() => {
    const execValidates = async (): Promise<void> => {
      const validate = new ValidateHome()
      validate.validateJWT()
      await validate.validateWithLogin()
    }
    void execValidates()
  }, [])
  return (
    <IonPage>
      <Header isLoggedIn />
      <IonContent className='ion-padding'>
        <h1>Quick Report Projects</h1>
        <IonButton id='present-alert'><IonIcon icon={addCircle} /></IonButton>
        <IonAlert
          trigger='present-alert'
          header='Please enter your info'
          buttons={['OK']}
          inputs={[
            {
              placeholder: 'Name'
            },
            {
              placeholder: 'Nickname (max 8 characters)',
              attributes: {
                maxlength: 8
              }
            },
            {
              type: 'number',
              placeholder: 'Age',
              min: 1,
              max: 100
            },
            {
              type: 'textarea',
              placeholder: 'A little about yourself'
            }
          ]}
        />
        <Project />
      </IonContent>
      <Footer />
    </IonPage>
  )
}

export { Page }
