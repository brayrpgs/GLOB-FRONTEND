import { IonContent, IonPage } from '@ionic/react'
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'
import { RequestHelper } from '../../Helpers/RequestHelper'
import { METHOD_HTTP, RESPONSE_TYPE } from '../../Helpers/FetchHelper'
import { TOKEN_KEY_NAME, USER_API_SECURITY_URL } from '../../common/Common'
import { User } from '../../models/User'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { TokenPayload } from '../../models/TokenPayload'

const Page: React.FC = () => {
  const [user, setUser] = useState<User>()
  useEffect(() => {
    void getUserData()
      .then(user => setUser(user[0]))
      .catch(error => console.error(error))
  }, [])
  return (
    <IonPage>
      <Header isLoggedIn />
      <IonContent className='ion-padding'>
        <h1>Welcome {user?.USERNAME}</h1>
        <p>Welcome to our application! We're glad to have you here. Explore the features and enjoy your experience.</p>
      </IonContent>
      <Footer />
    </IonPage>
  )
}

const getUserData = async (): Promise<User[]> => {
  const jwt = jwtDecode<TokenPayload>(localStorage.getItem(TOKEN_KEY_NAME) as string)
  const userData = new RequestHelper(
    USER_API_SECURITY_URL,
    METHOD_HTTP.GET,
    RESPONSE_TYPE.JSON,
    null,
    { user_id: jwt.id }
  )
  userData.addHeaders('accept', 'application/json')

  // execute request
  return await userData.buildRequest<User[]>()
}

export { Page }
