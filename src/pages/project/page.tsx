import React from 'react'
/**
 * imports components
 */
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'
import { IonPage } from '@ionic/react'
import { URLHelper } from '../../Helpers/URLHelper'
/**
 * import styles
 */

const Page: React.FC = () => {
  return (
    <>
      <IonPage>
        <Header isLoggedIn />
        <h1>Project: name_value
          {}
        </h1>
        <Footer />
      </IonPage>
    </>
  )
}
export { Page }
