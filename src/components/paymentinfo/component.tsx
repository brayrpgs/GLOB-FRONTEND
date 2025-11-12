import { IonButton } from '@ionic/react'
import styles from '../../styles/paymentinfo/styles.module.css'
const component: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Basic Plan</h2>
        <p>Choose the plan that fits your needs.</p>
        <ul>
          <li>Basic Plan - $10/month</li>
          <li>Feature:One project administration</li>
          <li>Feature:Have a dedicated account manager</li>
        </ul>
        <IonButton color='secondary' className={styles.buttons}>Subscribe</IonButton>
        <img src='/payment.svg' alt='payment-info' />
      </div>
      <div className={styles.header}>
        <h2>Plus Plan</h2>
        <p>Choose the plan that fits your needs.</p>
        <ul>
          <li>Plus Plan - $20/month</li>
          <li>Feature:three projects administration</li>
          <li>Feature:Have a dedicated account manager</li>
          <li>Feature:Access to premium templates</li>
          <li>Feature:Priority support</li>
          <li>Feature:Monthly performance reports</li>
          <li>Feature:Access to import Project of Jira</li>
        </ul>
        <IonButton color='secondary' className={styles.buttons}>Subscribe</IonButton>
        <img src='/payment.svg' alt='payment-info' />
      </div>
      <div className={styles.header}>
        <h2>Pro Plan</h2>
        <p>Choose the plan that fits your needs.</p>
        <ul>
          <li>Pro Plan - $45/month</li>
          <li>Feature:Five projects administration</li>
          <li>Feature:Have a dedicated account manager</li>
          <li>Feature:Access to premium templates</li>
          <li>Feature:Priority support</li>
          <li>Feature:Monthly performance reports</li>
          <li>Feature:Advanced analytics dashboard</li>
          <li>Feature:Notifications live</li>
          <li>Feature:Access to import Project of Jira</li>
          <li>Feature:Access to use ultimate AI</li>
        </ul>
        <IonButton color='secondary' className={styles.buttons}>Subscribe</IonButton>
        <img src='/payment.svg' alt='payment-info' />
      </div>
    </div>
  )
}

export { component }
