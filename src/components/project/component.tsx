import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonItem, IonLabel, IonList } from '@ionic/react'
import styles from '../../styles/project/styles.module.css'
import { useEffect, useState } from 'react'
import { albumsOutline, calendarNumberOutline, layers, listOutline } from 'ionicons/icons'
import { Project } from '../../models/Project'
import { GetUserProject } from '../../models/GetUserProject'
import { GetProject } from '../../models/GetProject'
import { ProjectStatus } from '../../enums/ProjectStatus'
import { TokenPayloadUtils } from '../../utils/TokenPayloadUtils'
import { UserProjectUtils } from '../../utils/UserProjectUtils'
import { ProjectsUtils } from '../../utils/ProjectsUtils'
import { ValidateProject } from '../../middleware/ValidateProject'
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
        <IonCard
          key={key}
          className={`${styles.animatedFadeHorizontal} ${styles.card}`}
          onClick={() => { new ValidateProject(`/project/${value.PROJECT_ID}`).redirect() }}
        >
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
            </IonList>
          </IonCardContent>
        </IonCard>
      ))}
    </>
  )
}

const getProyects = async (): Promise<Project[]> => {
  // step 1
  const tokenPayload = new TokenPayloadUtils().getTokenPayload()
  const getUserProject = await new UserProjectUtils().get<GetUserProject>(
    {
      user_id_fk: tokenPayload.id, page: 1, limit: 10
    }
  )
  // validate userProject
  if (getUserProject.totalData < 1) {
    return []
  }
  // step 2
  const getProject = await new ProjectsUtils().get<GetProject>(
    {
      user_project_id_fk: getUserProject.data[0].USER_PROJECT_ID, page: 1, limit: 10
    }
  )
  return getProject.data
}
