import React, { useEffect, useState } from 'react'
/**
 * imports components
 */
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'
import { IonAlert, IonButton, IonContent, IonIcon, IonInput, IonLabel, IonPage, IonTextarea } from '@ionic/react'
import { ProjectsUtils } from '../../utils/ProjectsUtils'
import { GetProject } from '../../models/GetProject'
import { URLHelper } from '../../Helpers/URLHelper'
import { Project } from '../../models/Project'
import { MESSAGE_NOT_EMPTY } from '../../common/MessageCommon'
import { create } from 'ionicons/icons'
/**
 * import styles
 */
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
        <IonContent className='ion-padding'>
          <h1>{project?.NAME.toUpperCase()}</h1>

          <IonButton
            id='openAlert'
            color='dark'
          >
            <IonIcon icon={create} />
            Edit
          </IonButton>
          <IonAlert
            trigger='openAlert'
            mode='ios'
            header='Config Project'
            buttons={[
              {
                text: 'Delete',
                handler: (value) => {}
              },
              {
                text: 'Edit',
                handler: (value) => {}
              }
            ]}
            inputs={[
              {
                type: 'text',
                value: project?.NAME
              }
            ]}
          />

        </IonContent>
        <Footer />
      </IonPage>
    </>
  )
}
export { Page }
