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
import { UserProjectUtils } from '../../utils/UserProjectUtils'
import { TokenPayloadUtils } from '../../utils/TokenPayloadUtils'
import { GetUserProject } from '../../models/GetUserProject'
import { NotificationChannel } from '../../enums/NotificationChannel'
import { IssueUtils } from '../../utils/IssueUtils'
import { GetIssues } from '../../models/GetIssues'
// function

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
      const exec = async (): Promise<void> => {
        const eventData: SSEData = JSON.parse(event.data)

        if (eventData.type === 'connection') return

        const canViewNotify = await canViewNotification(eventData)
        if (!canViewNotify) return

        let message = ''
        const table = eventData.table
        const data = eventData.data ?? {}

        // Determine the descriptive name safely
        const descriptiveName: string = data.NAME ?? data.SUMMARY ?? `item in ${table}`

        switch (eventData.operation) {
          case 'INSERT':
            message = `A new ${table.toLowerCase()} "${descriptiveName}" has been created, see more details.`
            break
          case 'UPDATE':
            message = `The ${table.toLowerCase()} "${descriptiveName}" you are assigned to has been updated.`
            break
          case 'DELETE':
            message = `The ${table.toLowerCase()} "${descriptiveName}" you were enrolled in has been deleted.`
            break
          default:
            message = `Change in ${table}: A record was ${eventData.operation}ED in channel ${eventData.channel}.`
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
      void exec()
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
        }} className='notificationsPopover'
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

const canViewNotification = async (eventData: SSEData): Promise<boolean> => {
  const userId = new TokenPayloadUtils().getTokenPayload().id
  const userProyect = await new UserProjectUtils().get<GetUserProject>(
    {
      user_id_fk: userId, page: 1, limit: 10
    }
  )
  // userProyect.data[0].USER_PROJECT_ID
  if (eventData.channel === NotificationChannel.user_project_changes) {
    return await searchUserProyect(eventData, userId)
  }
  if (eventData.channel === NotificationChannel.project_changes) {
    return await searchProyect(eventData, userId)
  }
  if (eventData.channel === NotificationChannel.issue_changes) {
    return await searchIssue(eventData, userId)
  }
  if (eventData.channel === NotificationChannel.sprint_changes) {
    return await searchSprint(eventData, userId)
  }
  return true
}

const searchUserProyect = async (eventData: SSEData, userId: number): Promise<boolean> => {
  return eventData.data.USER_ID_FK === userId
}
const searchProyect = async (eventData: SSEData, userId: number): Promise<boolean> => {
  return eventData.data.USER_PROJECT_ID_FK === userId
}

const searchIssue = async (eventData: SSEData, userId: number): Promise<boolean> => {
  return (
    eventData.data.USER_ASSIGNED_FK === userId ||
    eventData.data.USER_CREATOR_ISSUE_FK === userId ||
    eventData.data.USER_INFORMATOR_ISSUE_FK === userId
  )
}

const searchSprint = async (eventData: SSEData, userId: number): Promise<boolean> => {
  const issueUtils = new IssueUtils()
  const issuesResponse = await issueUtils.get<GetIssues>({
    sprint_id_fk: eventData.data.SPRINT_ID, page: 1, limit: 1000
  })

  if (issuesResponse.Issues.length > 0) {
    return issuesResponse.Issues.some(issue =>
      issue.USER_ASSIGNED_FK === userId || issue.USER_CREATOR_ISSUE_FK === userId || issue.USER_INFORMATOR_ISSUE_FK === userId
    )
  }
  return false
}

export { component }
