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
import { SSEData } from '../../models/SseData'
import { Notifications } from '../../models/Notification'
import { ValidateNotification } from '../../middleware/ValidateNotificantion'

//function

const component: React.FC = () => {
  const popover = useRef<HTMLIonPopoverElement>(null)
  const [notificationsList, setNotificationsList] = useState<Notifications[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    /**
     * Section validate
     */
    const Validate = new ValidateNotification('/')
    Validate.validateJWT()
    void Validate.validateWithLogin()
    /**
     * end section validate
     */
    const eventSource = new EventSource(NOTIFICATIONS_API_SSE_URL)

    eventSource.onmessage = (event) => {
      const eventData: SSEData = JSON.parse(event.data)

      let message = ''
      const operation = eventData.operation.toLowerCase()
      const table = eventData.table
      const data = eventData.data      
      // Determine the descriptive name from the data payload
      let descriptiveName: string = data.NAME == null ? data.SUMMARY : data.NAME

      if (descriptiveName == null) {
        descriptiveName = `item in ${table}`
      }

      switch (operation) {
        case 'insert':
          message = `A new ${table.toLowerCase()} "${descriptiveName}" has been created, see more details.`
          break
        case 'update':
          message = `The ${table.toLowerCase()} "${descriptiveName}" you are assigned to has been updated.`
          break
        case 'delete':
          message = `The ${table.toLowerCase()} "${descriptiveName}" you were enrolled in has been deleted.`
          break
        default:
          message = `Change in ${table}: A record was ${operation}ED in channel ${eventData.channel}.`
      }

      const newNotification: Notifications = {
        id: new Date().getTime().toString() + Math.random().toString(),
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

  const openPopover = (e: React.MouseEvent): void => {
    void popover.current?.present(e.nativeEvent)
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
      <IonPopover
        ref={popover} isOpen={isOpen} onDidDismiss={() => {
          setIsOpen(false)
          setNotificationsList([])
        }}
      >
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

export { component }
