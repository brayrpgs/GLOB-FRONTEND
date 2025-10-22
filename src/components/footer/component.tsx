import { IonFooter, IonToolbar } from '@ionic/react'
import styles from '../../styles/footer/styles.module.css'

const component: React.FC = () => {
  return (
    <IonFooter>
      <IonToolbar>
        <div className={styles.footer}>
          <div className={styles.footerTop}>
            <strong>Global Computer Applications</strong>
            <span className={styles.footerSmall}>2025</span>
          </div>
          <div className={styles.footerSmall}>
            © 2025 Global Computer Applications. All rights reserved.
          </div>
          <div className={styles.footerSmall}>
            Contact: rachel.bolivar.morales@una.cr • Instructor: Mag. Rachel Bolívar Morales
          </div>
        </div>
      </IonToolbar>
    </IonFooter>
  )
}
export { component }
