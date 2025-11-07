import { IonAlert, IonCard, IonCardHeader, IonCardTitle, IonContent, IonItem, IonList, IonProgressBar, IonSearchbar, useIonAlert } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { User } from '../../models/User'
import styles from '../../styles/users/styles.module.css'
import { UserUtils } from '../../utils/UserUtils'
import { URLHelper } from '../../Helpers/URLHelper'
import { IssueUtils } from '../../utils/IssueUtils'
import { GetIssues } from '../../models/GetIssues'
import { UserProjectUtils } from '../../utils/UserProjectUtils'
import { GetUserProject } from '../../models/GetUserProject'
import { UserProject } from '../../models/UserProject'
import { ProjectRole } from '../../enums/ProjectRole'
import { ValidateProject } from '../../middleware/ValidateProject'

interface MyUsers {
  user: User
  userProject: UserProject
}

const component: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [usersQuery, setUsersQuery] = useState<User[]>([])
  const [myUsers, setMyUsers] = useState<MyUsers[]>([])
  useEffect(() => {
    const exec = async (): Promise<void> => {
      const usersFromBackend = await new UserUtils().get<User[]>({})
      setUsers(usersFromBackend)
      const usersProjectFromBack = await getUsersProject()
      const myUserFromBackend = await getMyUsers(usersProjectFromBack)
      setMyUsers(myUserFromBackend)
    }
    void exec()
  }, [])
  const queryUsers = (query: string): void => {
    setUsersQuery(users.filter((user) => user.EMAIL.includes(query) || user.USERNAME.includes(query)))
    if (query.length === 0) {
      setUsersQuery([])
    }
  }

  return (
    <>
      <fieldset className={styles.userField}>
        <legend>{'users in project'.toUpperCase()}</legend>
        <IonContent className={styles.content}>
          <IonSearchbar
            animated
            placeholder='Search Users'
            onInput={(e) => { queryUsers(e.currentTarget.value as string) }}
            mode='ios'
          />
          <IonList mode='ios'>
            {usersQuery.map((value, key) => (
              <IonItem
                key={key}
                onClick={(e) => { console.log('hola') }}
                className={`${styles.userItem} ${styles.listSearchbar}`}
                color='medium'
                mode='ios'
              >
                {`${value.USERNAME} - ${value.EMAIL}`}
              </IonItem>
            ))}
          </IonList>
          <div>
            {myUsers.map((data, key) => (
              <IonCard className={`${styles.listSearchbar}`} key={key} mode='ios'>
                <IonCardTitle mode='ios' className='ion-padding'>{data.user.USERNAME}</IonCardTitle>
                <IonCardHeader mode='ios' className={styles.cardHeader}><img className={styles.cardImg} src={data.user.AVATAR_URL} alt='avatar image' />{data.user.EMAIL}</IonCardHeader>
                <IonCardHeader mode='ios' className={styles.cardHeader}>ROL: {ProjectRole[data.userProject.ROL_PROYECT]}</IonCardHeader>
                <IonCardHeader mode='ios' className={styles.cardHeader}>PRODUCTIVITY: <IonProgressBar className={getColorProgresBar(data.userProject.PRODUCTIVITY / 100)} value={data.userProject.PRODUCTIVITY / 100} buffer={data.userProject.PRODUCTIVITY / 100} mode='ios' /></IonCardHeader>
                <IonCardHeader mode='ios' className={styles.cardHeader}>
                  <select
                    defaultValue={data.userProject.ROL_PROYECT}
                    onChange={(e) => {
                      const newRol = e.currentTarget.value
                      const idUserProject = data.userProject.USER_PROJECT_ID
                      const idProject = new URLHelper().getPathId()
                      const exec = async (): Promise<void> => {
                        await new UserProjectUtils().patch(
                          {
                            rol_proyect: newRol
                          },
                          idUserProject
                        )
                        new ValidateProject(`/project/${idProject}`).redirect()
                      }
                      void exec()
                    }}
                  >
                    {Object.entries(ProjectRole).map((rol, key) => (
                      !isNaN(rol[1] as ProjectRole)
                        ? <option key={key} value={rol[1]}>{rol[0]}</option>
                        : ''
                    ))}
                  </select>
                  <button
                    className={styles.buttonDeleteColor}
                    onClick={() => {
                      void deleteMyUser(data.userProject.USER_PROJECT_ID)
                    }}
                  >{'delete'.toUpperCase()}
                  </button>
                </IonCardHeader>
              </IonCard>
            ))}
          </div>
        </IonContent>

      </fieldset>
    </>
  )
}
const getUsersProject = async (): Promise<UserProject[]> => {
  const idProject = new URLHelper().getPathId()
  const issues = await new IssueUtils().get<GetIssues>(
    {
      project_id_fk: idProject
    }
  )
  // processing data
  const idUsers = new Set<number>()
  issues.Issues.forEach((user) => {
    idUsers.add(user.USER_ASSIGNED_FK)
    idUsers.add(user.USER_CREATOR_ISSUE_FK)
    idUsers.add(user.USER_INFORMATOR_ISSUE_FK)
  })
  // get every user
  const userProjectArray: UserProject[] = []
  for (const id of idUsers.values()) {
    const usersProject = await new UserProjectUtils().get<GetUserProject>(
      {
        user_project_id: id
      }
    )
    userProjectArray.push(usersProject.data[0])
  }
  // ready
  return userProjectArray
}
const getMyUsers = async (usersProject: UserProject[]): Promise<MyUsers[]> => {
  const result: MyUsers[] = []
  for (const value of usersProject) {
    const user = await new UserUtils().get<User[]>(
      {
        user_id: value.USER_ID_FK
      }
    )
    result.push({
      user: user[0],
      userProject: value
    })
  }
  return result
}

const getColorProgresBar = (value: number): string => {
  if (value < 0.3) {
    return styles.progressBarDanger
  } else if (value < 0.6) {
    return styles.progressBarWarning
  } else {
    return styles.progressBarSuccess
  }
}

const deleteMyUser = async (idUserProject: number): Promise<void> => {
  // get issues
  const issuesAssigned = await new IssueUtils().get<GetIssues>(
    {
      user_assigned_fk: idUserProject,
      project_id_fk: new URLHelper().getPathId()
    }
  )
  const issuesCreator = await new IssueUtils().get<GetIssues>(
    {
      user_creator_issue_fk: idUserProject,
      project_id_fk: new URLHelper().getPathId()
    }
  )
  const issuesInformator = await new IssueUtils().get<GetIssues>(
    {
      user_informator_fk: idUserProject,
      project_id_fk: new URLHelper().getPathId()
    }
  )

  // patch every issue group
  for (const issue of issuesAssigned.Issues) {
    await new IssueUtils().patch(
      {
        user_assigned: null
      },
      issue.ISSUE_ID
    )
  }

  for (const issue of issuesCreator.Issues) {
    await new IssueUtils().patch(
      {
        user_creator: null
      },
      issue.ISSUE_ID
    )
  }

  for (const issue of issuesInformator.Issues) {
    await new IssueUtils().patch(
      {
        user_informator: null
      },
      issue.ISSUE_ID
    )
  }
}
export { component }
