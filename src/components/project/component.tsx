import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react'
import styles from '../../styles/project/styles.module.css'
import { useEffect } from 'react'
import { layers, listOutline, pricetagOutline } from 'ionicons/icons'
export const component: React.FC = () => {
  useEffect(() => { }, [])

  return (
    <IonCard className={`${styles.animatedFadeHorizontal} ${styles.card}`}>
      <IonCardHeader>
        <IonIcon className={styles.iconProject} icon={layers} size='large' />
        <IonCardTitle>Card Title</IonCardTitle>
        <IonCardSubtitle className={styles.suptitleCard}>
          <span><IonIcon icon={listOutline} color='primary' /> List Issues</span>
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          <IonItem className={styles.suptitleCard}>
            <span><IonIcon icon={pricetagOutline} color='warning' /> <IonLabel>Item</IonLabel></span>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  )
}

const getProyects = () => {

}
