import { IonAlert, IonButton, IonIcon, IonSelect, IonSelectOption } from '@ionic/react'
import { Project } from '../../models/Project'
import styles from '../../styles/project/styles.module.css'
import { create } from 'ionicons/icons'
import { ProjectStatus } from '../../enums/ProjectStatus'
import { URLHelper } from '../../Helpers/URLHelper'
import { ValidateHome } from '../../middleware/ValidateHome'
import { ProjectsUtils } from '../../utils/ProjectsUtils'
import { UserProjectUtils } from '../../utils/UserProjectUtils'
import { TokenPayloadUtils } from '../../utils/TokenPayloadUtils'
import { GetUserProject } from '../../models/GetUserProject'
import { useEffect, useRef, useState } from 'react'

interface componentProps {
  project: Project
}
const component: React.FC<componentProps> = ({ project }) => {
  const selectRef = useRef<HTMLIonSelectElement>(null)
  const [status, setStatus] = useState<string>(project?.STATUS?.toString() ?? '1')
  const styleFieldset: Record<number, string> = {
    1: styles.configProjectNotStarted,
    2: styles.configProjectInProgress,
    3: styles.configProjectSuccess
  }
  const styleSelect: Record<number, string> = {
    1: styles.warning,
    2: styles.secondary,
    3: styles.success
  }

  useEffect(() => {
    setStatus(project?.STATUS?.toString() ?? '1')
  }, [project])
  return (
    <>
      <fieldset className={styleFieldset[parseInt(status)]}>
        <legend>{'settings project'.toUpperCase()}</legend>
        <IonButton
          id='openAlert'
          color='dark'
        >
          <IonIcon icon={create} />
          Config
        </IonButton>
        <IonAlert
          trigger='openAlert'
          mode='ios'
          header='Config Project'
          animated
          buttons={[
            {
              text: 'Delete',
              handler: (value) => {
                const exec = async (): Promise<void> => {
                  const idProject = new URLHelper().getPathId()
                  await new ProjectsUtils().delete(idProject)
                  new ValidateHome('/home').redirect()
                }
                void exec()
              },
              cssClass: styles.danger
            },
            {
              text: 'Edit',
              handler: (value) => {
                const exec = async (): Promise<void> => {
                  const idProject = new URLHelper().getPathId()
                  const userProject = await new UserProjectUtils().get<GetUserProject>(
                    {
                      user_id_fk: new TokenPayloadUtils().getTokenPayload().id
                    }
                  )
                  const body = {
                    name: value[0],
                    description: value[1],
                    user_project_id_fk: userProject.data[0].USER_PROJECT_ID,
                    date_init: value[2],
                    date_end: value[3],
                    status
                  }
                  try {
                    await new ProjectsUtils().patch(body, idProject)
                    new ValidateHome(`/project/${idProject}`).redirect()
                  } catch (error) {
                    console.error(error)
                    new ValidateHome(`/project/${idProject}`).redirect()
                  }
                }
                void exec()
              },
              cssClass: styles.edit
            }
          ]}
          inputs={[
            {
              type: 'text',
              value: project?.NAME,
              label: 'Name Project'.toUpperCase(),
              placeholder: 'Name Project'.toUpperCase()
            },
            {
              type: 'text',
              value: project?.DESCRIPTION,
              label: 'DESCRIPTION Project'.toUpperCase(),
              placeholder: 'DESCRIPTION Project'.toUpperCase()
            },
            {
              type: 'date',
              value: project?.DATE_INIT,
              label: 'DATE INIT'.toUpperCase(),
              placeholder: 'DATE INIT'.toUpperCase()
            },
            {
              type: 'date',
              value: project?.DATE_END,
              label: 'DATE END'.toUpperCase(),
              placeholder: 'DATE END'.toUpperCase()
            }
          ]}
        />
        <IonSelect
          labelPlacement='floating' label='STATUS PROJECT'
          mode='ios'
          ref={selectRef}
          defaultValue={project?.STATUS}
          className={`${styles.select} ${styleSelect[parseInt(status)]}`}
          value={status}
          onIonChange={(e) => {
            const exec = async (): Promise<void> => {
              const idProject = new URLHelper().getPathId()
              const body = {
                status: e.detail.value
              }
              const result = await new ProjectsUtils().patch<Project>(body, idProject)
              setStatus(result.STATUS.toString())
            }
            void exec()
          }}
          id='select'
        >
          <IonSelectOption value='1'>{ProjectStatus[1]}</IonSelectOption>
          <IonSelectOption value='2'>{ProjectStatus[2]}</IonSelectOption>
          <IonSelectOption value='3'>{ProjectStatus[3]}</IonSelectOption>
        </IonSelect>

      </fieldset>
    </>
  )
}
export { component }
