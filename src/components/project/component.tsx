import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItem, IonLabel, IonList, IonProgressBar } from '@ionic/react'
import styles from '../../styles/project/styles.module.css'
import { useEffect, useState } from 'react'
import { albumsOutline, analyticsOutline, calendarNumberOutline, layers, listOutline } from 'ionicons/icons'
import { Project } from '../../models/Project'
import { PROJECT_API_DATA_APLICATION_URL, TOKEN_KEY_NAME, USER_PROJECT_API_DATA_APLICATION_URL } from '../../common/Common'
import { TokenHelper } from '../../Helpers/TokenHelper'
import { RequestHelper } from '../../Helpers/RequestHelper'
import { METHOD_HTTP, RESPONSE_TYPE } from '../../Helpers/FetchHelper'
import { GetUserProject } from '../../models/GetUserProject'
import { GetProject } from '../../models/GetProject'
import { ProjectStatus } from '../../enums/ProjectStatus'
export const component: React.FC = () => {
  const [projects, SetProjects] = useState<Project[]>()
  useEffect(() => {
    const exec = async (): Promise<void> => {
      const projects = await getProyects()
      SetProjects(projects)
    }
    void exec()
  }, [])

  return (
    <>
      {projects?.map((value, key) => (
        <IonCard key={key} className={`${styles.animatedFadeHorizontal} ${styles.card}`}>
          <IonCardHeader>
            <IonIcon className={`${styles.iconProject} ${styles.bloom}`} icon={layers} size='large' />
            <IonCardTitle>{value.NAME}</IonCardTitle>
            <IonCardSubtitle className={styles.suptitleCard}>
              <span><IonIcon icon={listOutline} color='primary' /> {value.DESCRIPTION}</span>
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem className={styles.suptitleCard}>
                <span><IonIcon className={styles.bloom} icon={albumsOutline} color='warning' /> <IonLabel>Status: {ProjectStatus[value.STATUS]}</IonLabel></span>
              </IonItem>
              <IonItem className={styles.suptitleCard}>
                <span><IonIcon className={styles.bloom} icon={calendarNumberOutline} color='dark' /> <IonLabel>Date Init: {['-infinity', 'infinity'].includes(value.DATE_INIT) ? 'No Date Set' : value.DATE_INIT}</IonLabel></span>
              </IonItem>
              <IonItem className={styles.suptitleCard}>
                <span><IonIcon className={styles.bloom} icon={calendarNumberOutline} color='dark' /> <IonLabel>Date End: {['-infinity', 'infinity'].includes(value.DATE_END) ? 'No Date Set' : value.DATE_INIT}</IonLabel></span>
              </IonItem>
              <IonItem className={styles.suptitleCard}>
                <span>
                  <IonIcon className={styles.bloom} icon={analyticsOutline} color='warning' /> Progress: <IonProgressBar buffer={value.PROGRESS} value={value.PROGRESS} />
                </span>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
      ))}
    </>
  )
}

const getProyects = async (): Promise<Project[]> => {
  // step 1
  const token = localStorage.getItem(TOKEN_KEY_NAME) as string
  const tokenPayload = new TokenHelper(token).decode()
  const requestUserProject = new RequestHelper(
    USER_PROJECT_API_DATA_APLICATION_URL,
    METHOD_HTTP.GET,
    RESPONSE_TYPE.JSON,
    null,
    {
      user_id_fk: tokenPayload.id, page: 1, limit: 10
    }
  )
  requestUserProject.addHeaders('accept', 'application/json')
  requestUserProject.addHeaders('Authorization', token)
  const getUserProject = await requestUserProject.buildRequest<GetUserProject>()
  // validate userProject
  if (getUserProject.totalData > 1 || getUserProject.totalData < 1) {
    return []
  }
  // step 2
  const requestProject = new RequestHelper(
    PROJECT_API_DATA_APLICATION_URL,
    METHOD_HTTP.GET,
    RESPONSE_TYPE.JSON,
    null,
    {
      user_project_id_fk: getUserProject.data[0].USER_PROJECT_ID, page: 1, limit: 10
    }
  )
  requestProject.addHeaders('accept', 'application/json')
  requestProject.addHeaders('Authorization', token)
  const getProject = await requestProject.buildRequest<GetProject>()
  return getProject.data
}
