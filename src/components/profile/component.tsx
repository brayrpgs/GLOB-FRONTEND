import { IonAvatar } from '@ionic/react'
import styles from '../../styles/profile/styles.module.css'

const Component: React.FC = () => {
  return (
    <IonAvatar className={styles.profileComponent}>
      <img alt="Silhouette of a person's head" src='https://ionicframework.com/docs/img/demos/avatar.svg' />
    </IonAvatar>
  )
}

export { Component }
