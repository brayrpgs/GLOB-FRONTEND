import React, { useEffect, useState } from 'react'
/**
 * imports components
 */
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'
import { component as Alert } from '../../components/alertproject/component'
import { component as Users } from '../../components/users/component'
import { component as Issues } from '../../components/issues/component'
import { component as Sprints } from '../../components/sprints/component'
import { component as UserProGraph } from '../../components/userprograph/component'
import { component as ProjectGraph } from '../../components/projectgraph/component'
/**
 * imports ionic
 */
import { IonBackButton, IonContent, IonItemDivider, IonLabel, IonPage } from '@ionic/react'
/** * imports utils and models
 */
import { ProjectsUtils } from '../../utils/ProjectsUtils'
import { GetProject } from '../../models/GetProject'
import { URLHelper } from '../../Helpers/URLHelper'
import { Project } from '../../models/Project'
/**
 * import styles
 */
import styles from '../../styles/project/styles.module.css'
const Page: React.FC = () => {
  const [project, setProject] = useState<Project>()

  useEffect(() => {
    const exec = async (): Promise<void> => {
      // get data prject
      const projectBackend = await new ProjectsUtils().get<GetProject>({
        project_id: new URLHelper().getPathId()
      })
      // update project
      setProject(projectBackend.data[0])
    }
    void exec()
  }, [])
  return (
    <>
      <IonPage>
        <Header isLoggedIn />
        <IonBackButton mode='ios' defaultHref='/home' color='secondary' className={styles.backButton}>Back</IonBackButton>
        <IonContent className='ion-padding'>
          <h1 className={styles.title}>{project?.NAME.toUpperCase()}</h1>
          <div className={styles.containerInfo}>
            <Alert project={project as Project} />
            <Users />
            <Issues />
            <Sprints />
          </div>
          <div>
            <h2 className={styles.monitorTitle}>{'Estadistics and Monitor Dashboard'.toUpperCase()}</h2>
            <IonItemDivider color='light'>
              <UserProGraph />
              <ProjectGraph />
            </IonItemDivider>
          </div>
        </IonContent>
        <Footer />
      </IonPage>
    </>
  )
}
export { Page }
