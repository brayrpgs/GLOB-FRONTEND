import { IonContent, IonPage } from '@ionic/react'
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'

const Page: React.FC = () => {
  return (
    <IonPage>
      <Header isLoggedIn />
      <IonContent className='ion-padding'>
        <h1>Quick Report</h1>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam, laboriosam nihil unde enim rem reprehenderit voluptatibus ad voluptate minima, cumque, eius veritatis. Delectus autem aspernatur, officiis ab et quis illum.
          Sunt, quaerat. Minus, tempore cupiditate. Omnis distinctio consequuntur dolore delectus ex cupiditate recusandae earum atque nulla consectetur assumenda vero aliquid veniam quibusdam odio voluptatibus, mollitia, voluptas minus reiciendis impedit ullam!
        </p>
      </IonContent>
      <Footer />
    </IonPage>
  )
}

export { Page }
