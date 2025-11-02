import { IonAlert, IonContent, IonIcon, IonPage } from '@ionic/react'
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'
import { ValidateHome } from '../../middleware/ValidateHome'
import { component as Project } from '../../components/project/component'
import { useEffect } from 'react'
import { addCircle } from 'ionicons/icons'
import styles from '../../styles/main/styles.module.css'

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
        <IonIcon className={styles.cursorPointer} id='present-alert' icon={addCircle} size='large' />
        <IonAlert
          trigger='present-alert'
          header='Create a new Project'
          buttons={[
            {
              text: 'create'.toUpperCase(),
              handler: undefined
            },
            {
              text: 'cancel'.toUpperCase(),
              handler: undefined
            }
          ]}
          inputs={[
            {
              placeholder: 'name'.toUpperCase()
            },
            {
              placeholder: 'description'.toUpperCase(),
              attributes: {
                maxlength: 8
              }
            },
            {
              type: 'datetime-local',
              placeholder: 'date init'.toUpperCase()
            },
            {
              type: 'datetime-local',
              placeholder: 'date init'.toUpperCase()
            },
            {
              type: 'number',
              placeholder: 'progress'.toUpperCase(),
              min: 0,
              max: 100
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
