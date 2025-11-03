import { AlertButton, AlertInput, IonAlert, IonContent, IonIcon, IonPage, useIonToast } from '@ionic/react'
import { component as Header } from '../../components/header/component'
import { component as Footer } from '../../components/footer/component'
import { ValidateHome } from '../../middleware/ValidateHome'
import { component as Project } from '../../components/project/component'
import { useEffect, useState } from 'react'
import { addCircle } from 'ionicons/icons'
import styles from '../../styles/main/styles.module.css'
import { ToastBuilder } from '../../components/toast/ToastBuilder'
import { ProjectsUtils } from '../../utils/ProjectsUtils'
import { Project as P } from '../../models/Project'
import { TokenPayloadUtils } from '../../utils/TokenPayloadUtils'
import { ProjectStatus } from '../../enums/ProjectStatus'
import { UserProjectUtils } from '../../utils/UserProjectUtils'
import { GetUserProject } from '../../models/GetUserProject'

const Page: React.FC = () => {
  const [toast] = useIonToast()
  const [canCreate, setCanCreate] = useState(true)
  const handlerCreateNewProject = async (data: Record<number, string>): Promise<void> => {
    const validate = new ValidateHome('/home')
    /**
     * handle validate fields
     */
    if (!validate.validateFields(data)) {
      const danger = new ToastBuilder()
        .setAnimated(true)
        .setColor('danger')
        .setDuration(1500)
        .setMessage('Project not was created , check field please')
        .setPosition('bottom')
        .setTranslucent(true)
        .setMode('ios')
      await toast(danger.build())
      return
    }

    /**
   * Get user-project logged
   */
    const userProject = await new UserProjectUtils().get<GetUserProject>(
      {
        user_id_fk: new TokenPayloadUtils().getTokenPayload().id
      }
    )
    /**
   * create a new project
   */
    const requestProject = await new ProjectsUtils().post<P[]>(
      {
        name: data[0].trim(),
        description: data[1].trim(),
        user_project_id_fk: userProject.data[0].USER_PROJECT_ID,
        date_init: data[2],
        date_end: data[3],
        status: ProjectStatus['Not Started'],
        progress: 0
      }
    )
    if (requestProject.length !== 1) {
      /**
     * Show the error message
     */
      const danger = new ToastBuilder()
        .setAnimated(true)
        .setColor('danger')
        .setDuration(1500)
        .setMessage('Project not created , wait a few minuts ...')
        .setPosition('bottom')
        .setTranslucent(true)
        .setMode('ios')
      await toast(danger.build())
    } else {
      /**
     * Show the error message
     */
      const success = new ToastBuilder()
        .setAnimated(true)
        .setColor('success')
        .setDuration(1500)
        .setMessage('Project Created!')
        .setPosition('bottom')
        .setTranslucent(true)
        .setMode('ios')
      await toast(success.build())
      setTimeout(() => {
        validate.redirect()
      }, 2000)
    }
  }
  /**
   * inputs of modals
   */
  const inputs: AlertInput[] = [
    {
      placeholder: 'name'.toUpperCase(),
      value: ''
    },
    {
      placeholder: 'description'.toUpperCase(),
      attributes: {
        maxlength: 8
      },
      value: ''
    },
    {
      type: 'date',
      placeholder: 'date init'.toUpperCase()
    },
    {
      type: 'date',
      placeholder: 'date end'.toUpperCase()
    }
  ]
  /**
   * Buttons of modals
   */
  const buttons: AlertButton[] = [
    {
      text: 'create'.toUpperCase(),
      handler: (data: Record<number, string>) => {
        console.table(data)
        void handlerCreateNewProject(data)
      }
    },
    {
      text: 'cancel'.toUpperCase(),
      handler: undefined,
      cssClass: styles['color-red']
    }
  ]
  useEffect(() => {
    const execValidates = async (): Promise<void> => {
      const validate = new ValidateHome()
      validate.validateJWT()
      await validate.validateWithLogin()
      const canCreate = await validate.canCreateProject()
      setCanCreate(canCreate)
    }
    void execValidates()
  }, [])
  return (
    <IonPage>
      <Header isLoggedIn />
      <IonContent className='ion-padding'>
        <h1>Quick Report Projects</h1>
        {
          canCreate
            ? <IonIcon className={styles.cursorPointer} id='present-alert' icon={addCircle} size='large' />
            : ''
        }

        <IonAlert
          trigger='present-alert'
          header='Create a new Project'
          buttons={buttons}
          inputs={inputs}
        />
        <div className={styles.container}><Project /></div>
      </IonContent>
      <Footer />
    </IonPage>
  )
}

export { Page }
