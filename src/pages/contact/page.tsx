import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonIcon
} from '@ionic/react'
import { useState } from 'react'
import { mailOutline, personOutline, chatboxEllipsesOutline } from 'ionicons/icons'
import styles from '../../styles/contact/styles.module.css'
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'

const Page: React.FC = () => {
  const [emailLabel, setEmailLabel] = useState('Email Address')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form Data:', formData)
    // You can add the logic to send the form here
    alert('Form submitted (check the console).')
  }

  return (
    <IonPage>
      <Header isLoggedIn={false} />
      <IonContent fullscreen className='ion-padding'>
        <div className={styles.contactContainer}>
          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <h1 className={`${styles.containerItem} ${styles.colorPrimary}`}>Contact Us</h1>
            <img src='/contact-us.jpg' alt='Contact Us' className={styles.imageContact} />
            <p className={styles.containerItem}>Have any questions? We'd love to hear from you.</p>
            <IonItem className={styles.containerItem}>
              <IonIcon className={styles.colorPrimary} icon={personOutline} slot='start' />
              <IonLabel position='floating'>Full Name</IonLabel>
              <IonInput name='fullName' value={formData.fullName} onIonChange={handleInputChange} required />
            </IonItem>
            <IonItem className={styles.containerItem}>
              <IonIcon className={styles.colorPrimary} icon={mailOutline} slot='start' />
              <IonLabel position='floating'>{emailLabel}</IonLabel>
              <IonInput type='email' name='email' value={formData.email} onIonChange={handleInputChange} required />
            </IonItem>
            <IonItem className={styles.containerItem}>
              <IonIcon className={styles.colorPrimary} icon={chatboxEllipsesOutline} slot='start' />
              <IonLabel position='floating'>Message</IonLabel>
              <IonTextarea name='message' value={formData.message} onIonChange={handleInputChange} rows={5} required />
            </IonItem>
            <IonButton color='secondary' expand='block' type='submit' className={styles.containerItem}>
              Send Message
            </IonButton>
          </form>
        </div>
      </IonContent>
      <Footer />
    </IonPage>
  )
}

export { Page }
