import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonTitle,
  IonToolbar
} from '@ionic/react'
import { notifications as notificationsIcon } from 'ionicons/icons'
import React, { useEffect, useRef, useState } from 'react'
import styles from '../../styles/notifications/styles.module.css'
import { NOTIFICATIONS_API_SSE_URL } from '../../common/Common'

interface Notification {
  id: string
  message: string
  timestamp: string
}

interface SSEData {
  channel: string
  data: Record<string, any>
  table: string
  operation: string
  id: string
  message: string
  timestamp: string
}

const NotificationsComponent: React.FC = () => {
  const popover = useRef<HTMLIonPopoverElement>(null)
  const [notificationsList, setNotificationsList] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const eventSource = new EventSource(NOTIFICATIONS_API_SSE_URL)

    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data) as SSEData

      const message = `Change in ${eventData.table}: A record was ${eventData.operation.toLowerCase()}ED in channel ${eventData.channel}.`

      const newNotification: Notification = {
        id: new Date().getTime().toString() + Math.random().toString(), // Using a more robust unique ID
        message,
        timestamp: eventData.timestamp
      }

      setNotificationsList((prevNotifications) => [
        newNotification,
        ...prevNotifications
      ])
    }

    eventSource.onerror = (_err) => {
      console.error('EventSource failed.')
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const openPopover = (e: React.MouseEvent) => {
    popover.current?.present(e.nativeEvent)
    setIsOpen(true)
  }

  return (
    <>
      <IonButtons>
        <IonButton onClick={openPopover} className={styles.colorPrimary}>
          <IonIcon icon={notificationsIcon} />
          {notificationsList.length > 0 && (
            <IonBadge color='danger'>{notificationsList.length}</IonBadge>
          )}
        </IonButton>
      </IonButtons>
      <IonPopover ref={popover} isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Notifications</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {notificationsList.map((notif) => (
              <IonItem key={notif.id}>
                <IonLabel>
                  <h2>{notif.message}</h2>
                  <p>{new Date(notif.timestamp).toLocaleString()}</p>
                </IonLabel>
              </IonItem>
            ))}
            {notificationsList.length === 0 && <IonItem>No notifications</IonItem>}
          </IonList>
        </IonContent>
      </IonPopover>
    </>
  )
}

export { NotificationsComponent as Component }
