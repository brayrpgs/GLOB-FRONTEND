import { IonAlert, IonButton, IonIcon } from '@ionic/react'
import { Project } from '../../models/Project'
import styles from '../../styles/project/styles.module.css'
import { create } from 'ionicons/icons'
import { ProjectStatus } from '../../enums/ProjectStatus'

interface componentProps {
  project: Project
}
const component: React.FC<componentProps> = ({ project }) => {
  return (
    <>
      <fieldset className={styles.configProject}>
        <legend>{'settings project'.toUpperCase()}</legend>
        <IonButton
          id='openAlert'
          color='warning'
        >
          <IonIcon icon={create} className={styles.bloom} />
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
              handler: (value) => { },
              cssClass: styles.danger
            },
            {
              text: 'Edit',
              handler: (value) => { },
              cssClass: styles.warning
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
        <select className={`${styles.select}`} defaultValue={ProjectStatus[project?.STATUS]}>
          <option value={ProjectStatus[1]}>{ProjectStatus[1]}</option>
          <option value={ProjectStatus[2]}>{ProjectStatus[2]}</option>
          <option value={ProjectStatus[3]}>{ProjectStatus[3]}</option>
        </select>

      </fieldset>
    </>
  )
}
export { component }
