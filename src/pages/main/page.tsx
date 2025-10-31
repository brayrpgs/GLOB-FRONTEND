import { IonContent, IonPage } from '@ionic/react'
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'
import { ValidateHome } from '../../middleware/ValidateHome'
import { component as Project } from '../../components/project/component'
import { useEffect } from 'react'

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
        <h1>Quick Report</h1>
        <Project />
      </IonContent>
      <Footer />
    </IonPage>
  )
}

export { Page }
