import React from 'react'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonPage
} from '@ionic/react'
import styles from '../../styles/landing/styles.module.css'
/**
 * components imports
 */
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'
import { component as Testimonials } from '../../components/testimonials/component'
import { bulbOutline, globe, notifications, rocketSharp, sparkles } from 'ionicons/icons'

const Page: React.FC = () => {
  return (
    <IonPage>
      <Header isLoggedIn={false} />
      <IonContent fullscreen className='ion-padding'>
        <IonCard className={styles.animationEnter}>
          <img className={styles.imgCard} src='https://www.manageengine.com/products/service-desk/itsm/images/it-project-management-software.png' alt='Project management software' />
          <IonCardHeader>
            <IonCardTitle> <IonIcon className={styles.iconRocket} icon={rocketSharp} /> The New Era of Intelligent Project Management</IonCardTitle>
            <IonCardSubtitle>Quick Report</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            Quick Report is a modern microservices-based architecture designed to transform how organizations manage their projects, teams, and workflows. Built with leading technologies and a modular approach, Quick Report delivers scalability, security, and enterprise-grade flexibility at every layer of its ecosystem.
          </IonCardContent>
        </IonCard>

        <div className={styles.containerInformation + ' ' + styles.animationEnter}>
          <img className={styles.imgInformation} src='banner1.png' alt='microservices' />
          <img className={styles.imgInformation} src='banner2.png' alt='microservices' />
        </div>

        <IonCard className={styles.animationEnter}>
          <img className={styles.imgCard + ' ' + styles.imgCardCover} src='https://econfortysalud.com/wp-content/uploads/usos-ia-arquitectura.jpg.webp' alt='Project Management Software' />
          <IonCardHeader>
            <IonCardTitle><IonIcon className={styles.iconGlobe} icon={globe} /> Future-Ready Architecture</IonCardTitle>
            <IonCardSubtitle>Quick Report</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <ul>
              Quick Report is not just a system, it's a growing platform.
              Its roadmap highlights:
              <li><IonIcon className={styles.iconNotification} icon={notifications} /> Real-Time Notification Service (SSE) — instant communication to keep teams always informed</li>
              <li><IonIcon className={styles.iconNotification} icon={sparkles} /> Artificial Intelligence Module — intelligent recommendations that optimize resource allocation and sprint planning.</li>
            </ul>
          </IonCardContent>
        </IonCard>

        <IonCard className={styles.animationEnter}>
          <img className={styles.imgCard + ' ' + styles.imgCardCover} src='https://video.udacity-data.com/topher/2024/October/670988f2_ud615/ud615.jpg' alt='Project Management Software' />
          <IonCardHeader>
            <IonCardTitle><IonIcon className={styles.iconNotification} icon={bulbOutline} /> The Best of Our Product</IonCardTitle>
            <IonCardSubtitle>Quick Report</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            An intelligent, secure, and scalable platform ready to integrate into any corporate environment or tech startup.
            Quick Report redefines project management with an architecture built for performance, continuous evolution, and real digital transformation.
          </IonCardContent>
        </IonCard>

        <Testimonials />

      </IonContent>
      <Footer />
    </IonPage>
  )
}
export { Page }
